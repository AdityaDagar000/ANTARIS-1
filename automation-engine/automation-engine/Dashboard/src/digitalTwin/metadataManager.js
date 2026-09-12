/**
 * Bharti Research Station - Digital Twin Metadata Architecture
 * Comprehensive component classification, semantic mapping, and autonomous CAD object resolution.
 */

// Room and Facility Top-Level Taxonomy
export const FACILITY_ROOMS = {
  CHP_ROOM: 'CHP Room',
  WATER_MANAGEMENT: 'Water Management',
  SEWAGE_MANAGEMENT: 'Sewage Management',
  DATA_TELECOM: 'Data & Telecom Centre'
};

// Explicit Curated Station Equipment Registry
export const COMPONENT_METADATA_REGISTRY = {
  // === CHP GENERATION ROOM (Generators 1, 2, 3) ===
  'EngineCore': {
    displayName: 'Unit 1 · Engine Core',
    subsystem: 'Power Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Thermal Prime Mover',
    description: 'Internal combustion diesel prime mover generating mechanical shaft power for Generator Unit 1.',
    telemetryType: 'Engine Core',
    telemetryEnabled: true
  },
  'BearingSystem': {
    displayName: 'Unit 1 · Main Bearing System',
    subsystem: 'Power Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Mechanical Support',
    description: 'Hydrodynamic sleeve bearings supporting crankshaft rotation under thermal and radial loads.',
    telemetryType: 'Bearing System',
    telemetryEnabled: true
  },
  'CoolingSystem': {
    displayName: 'Unit 1 · Heat Recovery & Cooling',
    subsystem: 'Heat Recovery & Cooling',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Thermal Management',
    description: 'Dual-circuit jacket water and charge air cooling loop with plate heat exchangers for facility heating.',
    telemetryType: 'Cooling System',
    telemetryEnabled: true
  },
  'LubricationSystem': {
    displayName: 'Unit 1 · Lube Oil Module',
    subsystem: 'Lubrication',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Fluid Handling',
    description: 'Pressurized lubrication module with oil cooler, dual cartridge filtration, and pre-lube pump.',
    telemetryType: 'Lubrication System',
    telemetryEnabled: true
  },
  'GeneratorSystem': {
    displayName: 'Unit 1 · Alternator System',
    subsystem: 'Electrical Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Synchronous Alternator',
    description: '415V 3-phase synchronous alternator converting shaft rotation to prime station electrical power.',
    telemetryType: 'Generator System',
    telemetryEnabled: true
  },
  'FuelSystem': {
    displayName: 'Unit 1 · Fuel Injection Module',
    subsystem: 'Fuel Infrastructure',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Fuel Feed',
    description: 'Polar-grade fuel delivery circuit with heated filters, common-rail delivery, and return line cooling.',
    telemetryType: 'Fuel System',
    telemetryEnabled: true
  },
  'IntakeSystem': {
    displayName: 'Unit 1 · Air Intake & Pre-Heater',
    subsystem: 'Combustion Air',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Air Handling',
    description: 'Combustion air filtration with intake air thermal pre-heating for Antarctic sub-zero conditions.',
    telemetryType: 'Intake System',
    telemetryEnabled: true
  },
  'ExhaustSystem': {
    displayName: 'Unit 1 · Exhaust Gas Heat Exchanger',
    subsystem: 'Exhaust & Heat Recovery',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Exhaust Heat Recovery',
    description: 'Thermal exhaust gas economizer recovering waste heat for facility district heating loops.',
    telemetryType: 'Exhaust System',
    telemetryEnabled: true
  },
  'ControlSystem': {
    displayName: 'Unit 1 · Generator Control Unit (GCU)',
    subsystem: 'Electrical & Control',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Automation & Control',
    description: 'Microprocessor engine controller handling synchronization, load-sharing, and governor regulation.',
    telemetryType: 'Control System',
    telemetryEnabled: true
  },
  'Frame': {
    displayName: 'Unit 1 · Bedplate & Anti-Vibration Skid',
    subsystem: 'Structural Support',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Structural',
    description: 'Heavy structural steel base frame with tuned elastomeric vibration isolators.',
    telemetryType: 'Frame',
    telemetryEnabled: true
  },
  'ProtectiveFrame': {
    displayName: 'Unit 1 · Enclosure Frame & Acoustical Shield',
    subsystem: 'Structural Support',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Structural',
    description: 'Acoustic attenuation and safety barrier isolating rotating equipment from the operating floor.',
    telemetryType: 'Protective Frame',
    telemetryEnabled: true
  },

  // Generator 2 (1 suffix)
  'EngineCore1': {
    displayName: 'Unit 2 · Engine Core',
    subsystem: 'Power Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Thermal Prime Mover',
    description: 'Unit 2 prime mover diesel generator providing secondary base load power to Bharti Station.',
    telemetryType: 'Engine Core',
    telemetryEnabled: true
  },
  'BearingSystem1': {
    displayName: 'Unit 2 · Bearing System',
    subsystem: 'Power Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Mechanical Support',
    description: 'Unit 2 precision sleeve bearings with temperature monitoring and dynamic lubrication.',
    telemetryType: 'Bearing System',
    telemetryEnabled: true
  },
  'CoolingSystem1': {
    displayName: 'Unit 2 · Cooling System',
    subsystem: 'Heat Recovery & Cooling',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Thermal Management',
    description: 'Unit 2 heat exchanger and coolant circulation network maintaining optimum thermal balance.',
    telemetryType: 'Cooling System',
    telemetryEnabled: true
  },
  'LubricationSystem1': {
    displayName: 'Unit 2 · Lubrication Module',
    subsystem: 'Lubrication',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Fluid Handling',
    description: 'Unit 2 lube oil conditioning loop with continuous particulate and moisture separation.',
    telemetryType: 'Lubrication System',
    telemetryEnabled: true
  },
  'GeneratorSystem1': {
    displayName: 'Unit 2 · Alternator System',
    subsystem: 'Electrical Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Synchronous Alternator',
    description: 'Unit 2 415V synchronous alternator feeding main electrical bus bar A.',
    telemetryType: 'Generator System',
    telemetryEnabled: true
  },
  'FuelSystem1': {
    displayName: 'Unit 2 · Fuel System',
    subsystem: 'Fuel Infrastructure',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Fuel Feed',
    description: 'Unit 2 fuel metering and high-pressure injection circuit.',
    telemetryType: 'Fuel System',
    telemetryEnabled: true
  },
  'IntakeSystem1': {
    displayName: 'Unit 2 · Intake System',
    subsystem: 'Combustion Air',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Air Handling',
    description: 'Unit 2 pre-conditioned combustion air delivery manifold.',
    telemetryType: 'Intake System',
    telemetryEnabled: true
  },
  'ExhaustSystem1': {
    displayName: 'Unit 2 · Exhaust System',
    subsystem: 'Exhaust & Heat Recovery',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Exhaust Heat Recovery',
    description: 'Unit 2 thermal exhaust stack with silencer and particulate trap.',
    telemetryType: 'Exhaust System',
    telemetryEnabled: true
  },
  'ControlSystem1': {
    displayName: 'Unit 2 · Control System',
    subsystem: 'Electrical & Control',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Automation & Control',
    description: 'Unit 2 digital control panel monitoring voltage regulation and safety shutdowns.',
    telemetryType: 'Control System',
    telemetryEnabled: true
  },
  'Frame1': {
    displayName: 'Unit 2 · Structural Bedplate',
    subsystem: 'Structural Support',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Structural',
    description: 'Unit 2 rigid bedplate mounted on anti-vibration damping isolators.',
    telemetryType: 'Frame',
    telemetryEnabled: true
  },
  'ProtectiveFrame1': {
    displayName: 'Unit 2 · Protective Frame',
    subsystem: 'Structural Support',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Structural',
    description: 'Unit 2 safety enclosure framework.',
    telemetryType: 'Protective Frame',
    telemetryEnabled: true
  },

  // Generator 3 (2 suffix)
  'EngineCore2': {
    displayName: 'Unit 3 · Engine Core',
    subsystem: 'Power Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Thermal Prime Mover',
    description: 'Unit 3 standby/peak generation prime mover configured for rapid automatic start.',
    telemetryType: 'Engine Core',
    telemetryEnabled: true
  },
  'BearingSystem2': {
    displayName: 'Unit 3 · Bearing System',
    subsystem: 'Power Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Mechanical Support',
    description: 'Unit 3 bearing assemblies and journal sleeves.',
    telemetryType: 'Bearing System',
    telemetryEnabled: true
  },
  'CoolingSystem2': {
    displayName: 'Unit 3 · Cooling System',
    subsystem: 'Heat Recovery & Cooling',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Thermal Management',
    description: 'Unit 3 emergency cooling circuit with dual fan radiator bank.',
    telemetryType: 'Cooling System',
    telemetryEnabled: true
  },
  'LubricationSystem2': {
    displayName: 'Unit 3 · Lubrication Module',
    subsystem: 'Lubrication',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Fluid Handling',
    description: 'Unit 3 pressurized oil lubrication system.',
    telemetryType: 'Lubrication System',
    telemetryEnabled: true
  },
  'GeneratorSystem2': {
    displayName: 'Unit 3 · Alternator System',
    subsystem: 'Electrical Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Synchronous Alternator',
    description: 'Unit 3 415V synchronous generator providing emergency reserve power.',
    telemetryType: 'Generator System',
    telemetryEnabled: true
  },
  'FuelSystem2': {
    displayName: 'Unit 3 · Fuel System',
    subsystem: 'Fuel Infrastructure',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Fuel Feed',
    description: 'Unit 3 fuel distribution line with automatic cut-off solenoid.',
    telemetryType: 'Fuel System',
    telemetryEnabled: true
  },
  'IntakeSystem2': {
    displayName: 'Unit 3 · Intake System',
    subsystem: 'Combustion Air',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Air Handling',
    description: 'Unit 3 heavy-duty air filter and intake ducting.',
    telemetryType: 'Intake System',
    telemetryEnabled: true
  },
  'ExhaustSystem2': {
    displayName: 'Unit 3 · Exhaust System',
    subsystem: 'Exhaust & Heat Recovery',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Exhaust Heat Recovery',
    description: 'Unit 3 insulated stainless exhaust ducting.',
    telemetryType: 'Exhaust System',
    telemetryEnabled: true
  },
  'ControlSystem2': {
    displayName: 'Unit 3 · Control System',
    subsystem: 'Electrical & Control',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Automation & Control',
    description: 'Unit 3 remote start sequencer and telemetry interface.',
    telemetryType: 'Control System',
    telemetryEnabled: true
  },
  'Frame2': {
    displayName: 'Unit 3 · Structural Bedplate',
    subsystem: 'Structural Support',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Structural',
    description: 'Unit 3 welded steel machine chassis.',
    telemetryType: 'Frame',
    telemetryEnabled: true
  },
  'ProtectiveFrame2': {
    displayName: 'Unit 3 · Protective Frame',
    subsystem: 'Structural Support',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Structural',
    description: 'Unit 3 safety cage and acoustical baffling.',
    telemetryType: 'Protective Frame',
    telemetryEnabled: true
  },

  // Generator Enclosures / Covers
  'GeneratorBox1': {
    displayName: 'Unit 3 · Acoustic Enclosure Shell',
    subsystem: 'Power Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Protective Enclosure',
    description: 'Insulated protective acoustic hood enclosing Unit 3 with automated overhead access.',
    telemetryType: 'Frame',
    telemetryEnabled: false
  },
  'GeneratorBox2': {
    displayName: 'Unit 1 · Acoustic Enclosure Shell',
    subsystem: 'Power Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Protective Enclosure',
    description: 'Insulated protective acoustic hood enclosing Unit 1 with motorized inspection lift.',
    telemetryType: 'Frame',
    telemetryEnabled: false
  },
  'GeneratorBox3': {
    displayName: 'Unit 2 · Cowling & Protective Enclosure',
    subsystem: 'Power Generation',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Protective Enclosure',
    description: 'Protective top cowling for Unit 2 generation compartment.',
    telemetryType: 'Frame',
    telemetryEnabled: false
  },

  // === WATER MANAGEMENT ROOM ===
  'WaterPump': {
    displayName: 'Freshwater Lake Intake Pump',
    subsystem: 'Raw Water Intake',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Centrifugal Pumping Unit',
    description: 'Submersible multi-stage centrifugal pump drawing raw glacial meltwater from Lake Priyadarshini.',
    telemetryType: 'Pump System',
    telemetryEnabled: true
  },
  'ElectricMotor': {
    displayName: 'Intake Pump Drive Motor',
    subsystem: 'Raw Water Intake',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Electric Drive Motor',
    description: 'Variable frequency 45kW induction motor driving the primary freshwater intake pump.',
    telemetryType: 'Pump System',
    telemetryEnabled: true
  },
  'FlexibleCoupling': {
    displayName: 'Shaft Damping Coupling',
    subsystem: 'Raw Water Intake',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Mechanical Transmission',
    description: 'Torsionally flexible elastomeric shaft coupling isolating motor vibration from pump bearings.',
    telemetryType: 'Pump System',
    telemetryEnabled: true
  },
  'HighPressureFeedPump': {
    displayName: 'RO High-Pressure Feed Pump',
    subsystem: 'Reverse Osmosis Filtration',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'High-Pressure Booster',
    description: 'Positive displacement multi-plunger pump elevating feed water to 55 bar for membrane separation.',
    telemetryType: 'Pump System',
    telemetryEnabled: true
  },
  'FeedPumpAndMotor': {
    displayName: 'RO Feed Pump & Drive Skid',
    subsystem: 'Reverse Osmosis Filtration',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Integrated Pumping Skid',
    description: 'Direct-coupled high-pressure feed pump and heavy-duty electric drive motor on vibration skid.',
    telemetryType: 'Pump System',
    telemetryEnabled: true
  },
  'ROMembraneBank': {
    displayName: 'RO Membrane Pressure Vessels (Bank A)',
    subsystem: 'Reverse Osmosis Filtration',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Desalination & Purification',
    description: 'Parallel composite pressure vessels containing spiral-wound polyamide reverse osmosis membranes.',
    telemetryType: 'Filtration System',
    telemetryEnabled: true
  },
  'ROMembraneBank (1)': {
    displayName: 'RO Membrane Pressure Vessels (Bank B)',
    subsystem: 'Reverse Osmosis Filtration',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Desalination & Purification',
    description: 'Secondary stage reverse osmosis membrane array maximizing potable water recovery efficiency.',
    telemetryType: 'Filtration System',
    telemetryEnabled: true
  },
  'MembraneEndFittings': {
    displayName: 'High-Pressure Manifold End Fittings',
    subsystem: 'Reverse Osmosis Filtration',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Pressure Containment',
    description: 'Duplex stainless steel end-cap distribution ports routing concentrate and permeate streams.',
    telemetryType: 'Piping / Valve Network',
    telemetryEnabled: true
  },
  'PreFilterBank': {
    displayName: 'Multi-Media Cartridge Pre-Filter Bank',
    subsystem: 'Raw Water Intake',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Particulate Filtration',
    description: '5-micron graduated sediment pre-filtration protecting high-pressure pumps and membranes.',
    telemetryType: 'Filtration System',
    telemetryEnabled: true
  },
  'PrimaryFilter': {
    displayName: 'Primary Sand & Carbon Filter Vessel',
    subsystem: 'Raw Water Intake',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Media Filtration',
    description: 'Dual-media vessel for suspended solid removal and organic adsorption prior to fine filtration.',
    telemetryType: 'Filtration System',
    telemetryEnabled: true
  },
  'FeedSuctionPiping': {
    displayName: 'RO Suction & Strainer Piping',
    subsystem: 'Piping & Distribution',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Process Piping',
    description: 'Stainless steel suction manifold with integrated magnetic basket strainer.',
    telemetryType: 'Piping / Valve Network',
    telemetryEnabled: true
  },
  'FilterPiping': {
    displayName: 'Inter-Filter Transfer Manifold',
    subsystem: 'Piping & Distribution',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Process Piping',
    description: 'Schedule 40 316L piping interconnecting pre-filtration vessels and booster headers.',
    telemetryType: 'Piping / Valve Network',
    telemetryEnabled: true
  },
  'PermeateProductLoop': {
    displayName: 'Potable Permeate Delivery Loop',
    subsystem: 'Potable Water Distribution',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Potable Water Loop',
    description: 'Hygienic distribution loop transferring purified drinking water to heated storage reservoirs.',
    telemetryType: 'Piping / Valve Network',
    telemetryEnabled: true
  },
  'CIPChemicalLoop': {
    displayName: 'Clean-In-Place (CIP) Flushing Loop',
    subsystem: 'Reverse Osmosis Filtration',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Sanitization System',
    description: 'Automated chemical sanitization and membrane descaling circulation loop with neutralization.',
    telemetryType: 'Piping / Valve Network',
    telemetryEnabled: true
  },
  'ConnectedPiping': {
    displayName: 'Facility Water Interconnect Piping',
    subsystem: 'Piping & Distribution',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Process Piping',
    description: 'Thermal-jacketed distribution lines routing water between treatment skids and storage tanks.',
    telemetryType: 'Piping / Valve Network',
    telemetryEnabled: true
  },
  'FittingsAndInstrumentation': {
    displayName: 'Conductivity & Flow Sensor Cluster',
    subsystem: 'Instrumentation & Monitoring',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Sensor Cluster',
    description: 'Online TDS, electrical conductivity, turbidimeter, and digital ultrasonic flowmeters.',
    telemetryType: 'Piping / Valve Network',
    telemetryEnabled: true
  },
  'SkidFrame': {
    displayName: 'RO Skid Main Structural Framework',
    subsystem: 'Structural Support',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Structural Skid',
    description: 'Corrosion-resistant structural channel frame supporting high-pressure membrane vessels.',
    telemetryType: 'Frame',
    telemetryEnabled: false
  },
  'SkidFrame (1)': {
    displayName: 'Pre-Treatment Skid Support Frame',
    subsystem: 'Structural Support',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Structural Skid',
    description: 'Mounting cradle for multi-media filters and chemical dosing pumps.',
    telemetryType: 'Frame',
    telemetryEnabled: false
  },
  'BaseFrame': {
    displayName: 'Water Plant Floor Mounting Platform',
    subsystem: 'Structural Support',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Structural Foundation',
    description: 'Epoxy-coated seismic isolation base securing water processing equipment.',
    telemetryType: 'Frame',
    telemetryEnabled: false
  },

  // === SEWAGE & WASTEWATER MANAGEMENT ===
  'ProcessDischargeLoop': {
    displayName: 'Wastewater Process Discharge Line',
    subsystem: 'Wastewater Treatment',
    room: FACILITY_ROOMS.SEWAGE_MANAGEMENT,
    category: 'Effluent Handling',
    description: 'Treated effluent discharge routing meeting Antarctic Treaty environmental protocol standards.',
    telemetryType: 'Pump System',
    telemetryEnabled: true
  },
  'RejectConcentrateLoop': {
    displayName: 'RO Concentrate Reject Circuit',
    subsystem: 'Wastewater Treatment',
    room: FACILITY_ROOMS.SEWAGE_MANAGEMENT,
    category: 'Brine Management',
    description: 'High-salinity brine reject line routed to evaporative recovery or controlled disposal.',
    telemetryType: 'Filtration System',
    telemetryEnabled: true
  },
  'InstrumentationAndDrain': {
    displayName: 'Effluent Quality Monitoring Station',
    subsystem: 'Environmental Compliance',
    room: FACILITY_ROOMS.SEWAGE_MANAGEMENT,
    category: 'Quality Telemetry',
    description: 'Continuous monitoring of biological oxygen demand (BOD), pH, and residual chlorine.',
    telemetryType: 'Piping / Valve Network',
    telemetryEnabled: true
  },
  'InstrumentationDrainNetwork': {
    displayName: 'Sanitary Graywater Collection Manifold',
    subsystem: 'Collection & Drainage',
    room: FACILITY_ROOMS.SEWAGE_MANAGEMENT,
    category: 'Drainage Network',
    description: 'Insulated vacuum collection header consolidating graywater from station quarters.',
    telemetryType: 'Piping / Valve Network',
    telemetryEnabled: true
  },

  // === DATA & TELECOM / SATELLITE ANTENNA ===
  'Data+Center.obj': {
    displayName: 'Station Compute & Telemetry Rack A',
    subsystem: 'Data Centre Infrastructure',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Computing Infrastructure',
    description: 'Redundant server cluster managing scientific telemetry, geophysical logging, and meteorological data.',
    telemetryType: 'Control System',
    telemetryEnabled: true
  },
  'Data+Center.obj (1)': {
    displayName: 'Station SCADA & Storage Rack B',
    subsystem: 'Data Centre Infrastructure',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Computing Infrastructure',
    description: 'SCADA supervisory control servers and high-availability network attached storage (NAS).',
    telemetryType: 'Control System',
    telemetryEnabled: true
  },
  'Box01': {
    displayName: 'Primary Core Network Cabinet',
    subsystem: 'Communications Network',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Network Distribution',
    description: 'Fiber-optic core patch panel, managed L3 switches, and secure satellite gateway routers.',
    telemetryType: 'Control System',
    telemetryEnabled: true
  },
  'Box02': {
    displayName: 'Telemetry & Field Terminal Cabinet',
    subsystem: 'Industrial Automation',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Network Distribution',
    description: 'PLC marshaling cabinet terminating sensor buses from CHP, water, and fuel storage.',
    telemetryType: 'Control System',
    telemetryEnabled: true
  },
  'ControlCabinet': {
    displayName: 'Facility Automation Control Enclosure 1',
    subsystem: 'Electrical & Control',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Power & Logic Distribution',
    description: 'Master power distribution, UPS battery backup controller, and climate regulation panel.',
    telemetryType: 'Control System',
    telemetryEnabled: true
  },
  'ControlCabinet (1)': {
    displayName: 'Facility Automation Control Enclosure 2',
    subsystem: 'Electrical & Control',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Power & Logic Distribution',
    description: 'Redundant automated bus transfer switch and building management system (BMS).',
    telemetryType: 'Control System',
    telemetryEnabled: true
  },
  'EBox': {
    displayName: 'Antenna Control Unit (ACU) Terminal',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Drive Electronics',
    description: 'Servo drive controller executing step-track, ephemeris, and monopulse satellite tracking algorithms.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: true
  },
  'EBox2': {
    displayName: 'RF Downconverter Power Unit',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'RF Conditioning',
    description: 'Regulated low-noise DC power supply for polar antenna tracking modules.',
    telemetryType: 'Control System',
    telemetryEnabled: true
  },
  'EBox (1)': {
    displayName: 'Antenna Motor Drive Enclosure',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Servo Drive Unit',
    description: 'Variable frequency inverter supplying precision azimuth and elevation torque.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: true
  },
  'GeoSphere02': {
    displayName: '3.8m Parabolic Satellite Reflector',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Antenna Aperture',
    description: 'Carbon-composite offset parabolic dish providing high-gain X/Ku-band uplink and downlink to India.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: true
  },
  'LNB': {
    displayName: 'Low Noise Block Downconverter (LNB)',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'RF Receiver Front-End',
    description: 'Cryogenically rated low-noise microwave amplifier downconverting 12 GHz signals to L-band.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: true
  },
  'AzimuthDrive': {
    displayName: 'Antenna Azimuth Turntable Drive',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Precision Drive Mechanism',
    description: 'High-torque harmonic drive motor controlling 360-degree horizontal rotation and orbital tracking.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: true
  },
  'ElevationDrive': {
    displayName: 'Antenna Elevation Tilt Actuator',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Precision Drive Mechanism',
    description: 'Precision ballscrew linear drive adjusting dish inclination angle from 5 to 90 degrees above horizon.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: true
  },
  'Gearbox': {
    displayName: 'Planetary Tracking Gearbox',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Mechanical Transmission',
    description: 'Zero-backlash planetary reduction gearbox resisting Antarctic wind gust deflection.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: true
  },
  'DriveMotor': {
    displayName: 'Synchronous Servo Tracking Motor',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Brushless Servo Motor',
    description: 'Brushless permanent magnet servo motor with high-resolution absolute optical encoder.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: true
  },
  'Sphere01': {
    displayName: 'Antenna Pedestal Bearing Housing',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Gimbal Mount',
    description: 'Precision dual-axis gimbal assembly anchoring the antenna assembly to station bedrock.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: false
  },
  'Sphere02': {
    displayName: 'Counterweight Assembly',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Dynamic Balancing',
    description: 'Inertial balance weight minimizing drive motor torque load during elevation changes.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: false
  },
  'Cylinder01': {
    displayName: 'Antenna Main Pedestal Column',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Structural Mast',
    description: 'Heavy structural steel support column with heated internal conduit raceway.',
    telemetryType: 'Frame',
    telemetryEnabled: false
  },
  'Cylinder03': {
    displayName: 'RF Waveguide Feed Horn',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Microwave Feed',
    description: 'Orthomode transducer and feed horn illuminating the sub-reflector.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: false
  },
  'Cylinder04': {
    displayName: 'Sub-Reflector Support Strut',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Structural Strut',
    description: 'Low-diffraction carbon fiber support arm positioning the Cassegrain sub-reflector.',
    telemetryType: 'Frame',
    telemetryEnabled: false
  },
  'Hedra01': {
    displayName: 'Microwave Transceiver Module',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'RF Electronics',
    description: 'Solid-state power amplifier (SSPA) and frequency upconverter for India National Link.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: true
  },
  'Hedra02': {
    displayName: 'Auxiliary Communication Terminal',
    subsystem: 'Satellite Communications',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'RF Electronics',
    description: 'Emergency Iridium pilot satellite transceiver and GPS/GLONASS timing receiver.',
    telemetryType: 'Positioning Drive',
    telemetryEnabled: true
  },

  // === ROOM SHELLS & ARCHITECTURAL STRUCTURES ===
  'CHP': {
    displayName: 'Water Treatment & Life Support Module',
    subsystem: 'Facility Enclosure',
    room: FACILITY_ROOMS.WATER_MANAGEMENT,
    category: 'Architectural Shell',
    description: 'Thermal insulated structural modular shell housing station desalination and water processing systems.',
    telemetryType: 'Frame',
    telemetryEnabled: false,
    isRoomShell: true
  },
  'CHP (1)': {
    displayName: 'Combined Heat & Power Generation Module',
    subsystem: 'Facility Enclosure',
    room: FACILITY_ROOMS.CHP_ROOM,
    category: 'Architectural Shell',
    description: 'Blast-shielded, thermally isolated plant building housing primary diesel generator sets and heat recovery.',
    telemetryType: 'Frame',
    telemetryEnabled: false,
    isRoomShell: true
  },
  'Body210': {
    displayName: 'Data Centre & Earth Station Module',
    subsystem: 'Facility Enclosure',
    room: FACILITY_ROOMS.DATA_TELECOM,
    category: 'Architectural Shell',
    description: 'Electromagnetically shielded module housing communications gear, servers, and antenna support platform.',
    telemetryType: 'Frame',
    telemetryEnabled: false,
    isRoomShell: true
  }
};

/**
 * Humanizes any CAD string (e.g. "RedPipe1a (1)" -> "Red Pipe 1a")
 */
export function humanizeCADName(rawName) {
  if (!rawName) return 'Facility Assembly';
  let clean = rawName
    .replace(/\s*\(\d+\)/g, '')
    .replace(/\.obj$/i, '')
    .replace(/[+_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d+)$/, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length ? clean : rawName;
}

/**
 * Spatial Room Classifier based on world position coordinates
 */
export function classifyRoomFromPosition(pos) {
  if (!pos) return FACILITY_ROOMS.CHP_ROOM;
  if (pos.x > 12) return FACILITY_ROOMS.WATER_MANAGEMENT;
  if (pos.z > 12 || pos.y > 6) return FACILITY_ROOMS.DATA_TELECOM;
  return FACILITY_ROOMS.CHP_ROOM;
}

/**
 * Autonomous Metadata Resolver for ALL CAD objects (including Body### and unmapped meshes)
 * Implements fallback hierarchy: Component -> Subsystem -> Room -> CAD Object
 */
export function resolveComponentMetadata(mesh, worldPos = null) {
  const rawName = mesh?.name || 'Component';

  // 1. Check exact curated registry first
  if (COMPONENT_METADATA_REGISTRY[rawName]) {
    const entry = COMPONENT_METADATA_REGISTRY[rawName];
    return {
      id: rawName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      objectName: rawName,
      displayName: entry.displayName,
      subsystem: entry.subsystem,
      room: entry.room,
      category: entry.category,
      description: entry.description,
      interactive: true,
      status: 'NORMAL',
      telemetryType: entry.telemetryType || 'Frame',
      telemetryEnabled: Boolean(entry.telemetryEnabled),
      isRoomShell: Boolean(entry.isRoomShell)
    };
  }

  // 2. Classify Pipe Networks
  if (/BluePipe/i.test(rawName)) {
    const humanName = humanizeCADName(rawName);
    return {
      id: 'pipe-' + rawName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      objectName: rawName,
      displayName: humanName + ' · Coolant & Potable Loop',
      subsystem: 'Hydronic & Cooling Piping',
      room: FACILITY_ROOMS.CHP_ROOM,
      category: 'Process Piping',
      description: 'Primary low-temperature chilled and treated water supply manifold maintaining station thermal homeostasis.',
      interactive: true,
      status: 'NORMAL',
      telemetryType: 'Piping / Valve Network',
      telemetryEnabled: true,
      isRoomShell: false
    };
  }

  if (/RedPipe/i.test(rawName)) {
    const humanName = humanizeCADName(rawName);
    return {
      id: 'pipe-' + rawName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      objectName: rawName,
      displayName: humanName + ' · Thermal Energy Loop',
      subsystem: 'Thermal Energy Recovery',
      room: FACILITY_ROOMS.CHP_ROOM,
      category: 'Thermal Loop',
      description: 'Pressurized high-temperature water circuit capturing engine jacket and exhaust thermal energy.',
      interactive: true,
      status: 'NORMAL',
      telemetryType: 'Piping / Valve Network',
      telemetryEnabled: true,
      isRoomShell: false
    };
  }

  if (/BronzePipe/i.test(rawName)) {
    const humanName = humanizeCADName(rawName);
    return {
      id: 'pipe-' + rawName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      objectName: rawName,
      displayName: humanName + ' · Fuel & Lubricant Conduit',
      subsystem: 'Fuel & Fluid Distribution',
      room: FACILITY_ROOMS.CHP_ROOM,
      category: 'Fuel Line',
      description: 'Bronze fuel delivery conduit supplying conditioned polar diesel from external storage day tanks.',
      interactive: true,
      status: 'NORMAL',
      telemetryType: 'Piping / Valve Network',
      telemetryEnabled: true,
      isRoomShell: false
    };
  }

  if (/Support/i.test(rawName)) {
    const humanName = humanizeCADName(rawName);
    return {
      id: 'support-' + rawName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      objectName: rawName,
      displayName: humanName + ' · Pipe Support Truss',
      subsystem: 'Piping Infrastructure',
      room: FACILITY_ROOMS.CHP_ROOM,
      category: 'Structural Support',
      description: 'Seismic and thermal expansion pipe rack anchoring fluid lines across station compartments.',
      interactive: true,
      status: 'NORMAL',
      telemetryType: 'Frame',
      telemetryEnabled: false,
      isRoomShell: false
    };
  }

  // 3. Autonomous resolution for unnamed Body### and other CAD parts
  const room = classifyRoomFromPosition(worldPos);
  const isBody = /^Body\d+$/i.test(rawName);
  const bodyId = isBody ? rawName.replace(/\D/g, '') : '';

  let subsystem = 'Station Auxiliary Systems';
  let category = 'Machinery Component';
  let desc = 'Engineered mechanical CAD assembly supporting Bharti Station operational infrastructure.';
  let displayName = humanizeCADName(rawName);

  if (isBody) {
    const idNum = parseInt(bodyId, 10);
    if (idNum >= 110 && idNum <= 130) {
      subsystem = 'Satellite Communications';
      category = 'Antenna Drive Assembly';
      displayName = 'Antenna Drive Component ' + bodyId;
      desc = 'Precision mechanical linkage and mounting bracket supporting satellite positioning mechanics.';
    } else if (idNum >= 25 && idNum <= 65) {
      subsystem = 'Power Generation Auxiliary';
      category = 'Fluid & Structural Fitting';
      displayName = 'Generator Fitting ' + bodyId;
      desc = 'High-strength alloy bracket and fluid interface coupling on generator bedplate.';
    } else if (idNum >= 66 && idNum <= 100) {
      subsystem = 'Water & Life Support';
      category = 'Piping Valve & Mount';
      displayName = 'Process Valve Fitting ' + bodyId;
      desc = 'Corrosion-resistant manifold flange and pipe support bracket in water treatment circuit.';
    } else {
      subsystem = room + ' Equipment';
      category = 'Structural Fitting';
      displayName = 'Structural Element ' + bodyId;
      desc = 'Precision CAD component supporting mechanical stability and system routing.';
    }
  }

  return {
    id: 'cad-' + rawName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    objectName: rawName,
    displayName,
    subsystem,
    room,
    category,
    description: desc,
    interactive: true,
    status: 'NORMAL',
    telemetryType: 'Frame',
    telemetryEnabled: false,
    isRoomShell: false
  };
}
