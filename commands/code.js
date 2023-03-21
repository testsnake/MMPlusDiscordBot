const fs = require('fs')
const path = require('path')
const { SlashCommandBuilder } = require('discord.js');

const { Capstone, ARCH_X86, MODE_64 } = require('@alexaltea/capstone-js')

// Initialize step, this should only be done once at the start of the program.
function getSections(path) {
    const fileContents = fs.readFileSync(path)
    const offsetNtHeader = fileContents.readInt32LE(0x3C)
    const offsetSections = offsetNtHeader + 0x108
    const sectionCount = fileContents.readInt16LE(offsetNtHeader + 0x06)
    const sectionSize = 0x28
    const sections = []

    for (let i = 0; i < sectionCount; i++) {
        const startIndex = offsetSections + i * sectionSize
    
        const section = {
            name: fileContents.slice(startIndex + 0x00, startIndex + 0x08).toString('ascii').replaceAll('\x00', ''),
            virtualSize: fileContents.readInt32LE(startIndex + 0x08),
            virtualAddress: fileContents.readInt32LE(startIndex + 0x0C),
            sizeOfRawData: fileContents.readInt32LE(startIndex + 0x10),
            pointerToRawData: fileContents.readInt32LE(startIndex + 0x14),
            pointerToRelocations: fileContents.readInt32LE(startIndex + 0x18),
            pointerToLinenumbers: fileContents.readInt32LE(startIndex + 0x1C),
            numberOfRelocations: fileContents.readInt16LE(startIndex + 0x20),
            numberOfLinenumbers: fileContents.readInt16LE(startIndex + 0x22),
            characteristics: fileContents.readUInt32LE(startIndex + 0x24),
        }

        sections.push(section)
    }

    return { sections: sections, data: fileContents }
}

function getBytes(exe, virtualAddress, length) {
    // The game always starts at 0x140000000, the .exe file at 0.
    virtualAddress -= 0x140000000

    if (exe.sections.length == 0) {
        throw Error('No sections.')
    }

    const startAddress = exe.sections[0].virtualAddress
    const endAddress = exe.sections.at(-1).virtualAddress + exe.sections.at(-1).sizeOfRawData

    // Clamp length to fit inside the address space.
    length = Math.min(length, endAddress - virtualAddress)

    if (virtualAddress < startAddress || virtualAddress + length > endAddress) {
        throw Error('Address out of range.')
    }

    const section = exe.sections.filter(s => virtualAddress > s.virtualAddress).at(-1)

    // Clamp length to fit inside the section.
    length = Math.min(length, section.sizeOfRawData - (virtualAddress - section.virtualAddress))

    if (virtualAddress + length > section.virtualAddress + section.sizeOfRawData) {
        throw Error('Address is out of section bounds.')
    }

    const physicalAddress = virtualAddress - section.virtualAddress + section.pointerToRawData
    const bytes = exe.data.slice(physicalAddress, physicalAddress + length)

    return bytes
}

function partition(arr, size) {
    const result = []

    for (let i = 0; i < arr.length; i += size) {
        const chunk = arr.slice(i, i + size)
        result.push(chunk)
    }

    return result
}

const directory = path.join(__dirname, '..',  'binary_files');
const paths = {
    '1.00': path.join(directory, 'DivaMegaMix_103.exe'),
    '1.01': path.join(directory, 'DivaMegaMix_103.exe'),
    '1.02': path.join(directory, 'DivaMegaMix_103.exe'),
    '1.03': path.join(directory, 'DivaMegaMix_103.exe'),
}
const executables = {}

for (key in paths) {
    const exe = getSections(paths[key])
    exe.sections.sort((a, b) => a.virtualAddress < b.virtualAddress)
    executables[key] = exe
}

const capstone = new Capstone(ARCH_X86, MODE_64)

// This goes in the command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('code')
        .setDescription('Display assembly code around a given address in MegaMix+.')
        .addStringOption(option => 
            option.setName('address')
            .setDescription('Memory address in the selected MegaMix+.')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('version')
            .setDescription('Select MegaMix+ version.')
            .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('binary')
            .setDescription('Display as binary.')
            .setRequired(false)
        ),

    async execute(interaction) {
        let length = 0x50
        let lineWrap = 16
        let showAddresses = true
        let showHeader = true
        let isBinary = interaction.options.getBoolean('binary') || false;
        
        try {
            if(!executables.hasOwnProperty(version)) {
                throw Error('Version does not exist.')
            }
        
            length = Math.max(1, Math.min(length, 1024))
            let bytes = getBytes(executables[version], address, length)
        
            const addressLength = (address + length).toString(16).length
            const addressString = addr => {
                return `0x${addr.toString(16).toUpperCase().padStart(addressLength, '0')} `
            }
        
            if (isBinary) {
                // Clamp to one byte value so it stays within 2 characters in hex.
                lineWrap = Math.max(1, Math.min(lineWrap, 256))
        
                // Convert to a list of byte strings
                bytes = [...bytes].map(b => b.toString(16).padStart(2, '0'))
                bytes = partition(bytes, lineWrap).map((line, index) => `${ showAddresses ? addressString(address + index * lineWrap) : '' }${ line.join(' ') }`).join('\n')
        
                if (showHeader) {
                    const header = (showAddresses ? ' '.repeat(addressLength + 3) : '') + [...Array(lineWrap).keys()].map(n => n.toString(16).toUpperCase().padStart(2, '0')).join(' ') + '\n'
                    bytes = header + bytes
                }
            } else {
                // Offsets will be cut off because of `https://github.com/AlexAltea/capstone.js/issues/15`.
                // `address + instruction.address - disassembled[0].address` is to correct that for at least the addresses.
        
                const disassembled = capstone.disasm(bytes, address)
                bytes = disassembled.map(instruction => `${addressString(address + instruction.address - disassembled[0].address)}${instruction.mnemonic} ${instruction.op_str}`).join('\n')
            }
        
            console.log(`\`\`\`${ bytes }\`\`\``)
        } catch(error) {
            console.log(error)
        }
    }
}
