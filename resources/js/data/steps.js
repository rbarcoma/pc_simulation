export const assemblySteps = [
  ['case-panel', 'Open Case Panel', 'Remove the side panel before working inside the chassis.'],
  ['motherboard', 'Install Motherboard', 'Place the board on standoffs and align the rear ports.'],
  ['cpu', 'Install CPU', 'Lower the processor into the socket without pressure.'],
  ['thermal-paste', 'Apply Thermal Paste', 'Use a small centered dot for even heat transfer.'],
  ['cooler', 'Install CPU Cooler', 'Mount the cooler and connect the CPU fan cable.'],
  ['ram', 'Insert RAM', 'Push the RAM into the DIMM slot until it clicks.'],
  ['storage', 'Install Storage Drive', 'Mount the SSD or drive in its tray.'],
  ['psu', 'Install Power Supply', 'Install the PSU with correct fan orientation.'],
  ['gpu', 'Install Graphics Card', 'Seat the GPU in the primary PCIe slot.'],
  ['power-cables', 'Connect Power Cables', 'Connect motherboard, CPU, GPU, and drive power.'],
  ['front-panel', 'Connect Front Panel Cables', 'Connect switches, LEDs, USB, and audio headers.'],
  ['cable-management', 'Cable Management', 'Route cables neatly for airflow and maintenance.'],
  ['close-case', 'Close Case', 'Reinstall the panel after checking all connections.'],
  ['power-test', 'Final Power Test', 'Power on and confirm fans, lights, and display output.'],
].map(([partId, title, instruction], index) => ({
  id: `assembly-${index + 1}`,
  mode: 'assembly',
  partId,
  title,
  instruction,
  points: 10,
}));

export const disassemblySteps = [
  ['power-test', 'Power Off Computer', 'Shut down and disconnect the AC power cord.'],
  ['case-panel', 'Remove Case Panel', 'Open the side panel to access components.'],
  ['power-cables', 'Disconnect Power Cables', 'Remove ATX, EPS, PCIe, and drive power cables.'],
  ['front-panel', 'Disconnect Front Panel Cables', 'Unplug case I/O headers from the motherboard.'],
  ['gpu', 'Remove GPU', 'Release the PCIe latch and remove the graphics card.'],
  ['storage', 'Remove Storage Drive', 'Disconnect and remove the storage drive.'],
  ['ram', 'Remove RAM', 'Open the DIMM latches and lift the memory out.'],
  ['cooler', 'Remove Cooler', 'Loosen the cooler gradually and lift it away.'],
  ['thermal-paste', 'Clean Thermal Paste', 'Clean old paste with isopropyl alcohol.'],
  ['cpu', 'Remove CPU', 'Open the socket latch and lift the CPU carefully.'],
  ['motherboard', 'Remove Motherboard', 'Unscrew the motherboard from the standoffs.'],
  ['psu', 'Remove PSU', 'Unscrew and slide the power supply out of the case.'],
].map(([partId, title, instruction], index) => ({
  id: `disassembly-${index + 1}`,
  mode: 'disassembly',
  partId,
  title,
  instruction,
  points: 10,
}));

export const stepsByMode = {
  assembly: assemblySteps,
  disassembly: disassemblySteps,
};
