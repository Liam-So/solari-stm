# Grand Central Digital Solari

A digital recreation of Grand Central's iconic Solari board with real-time transit data.

## Demo

See the live demo: [Solari STM](https://solari-stm.vercel.app/)

## Description

This project recreates the classic Solari split-flap display board once found in Grand Central Terminal, but with real-time transit data. The application renders a digital version of this iconic board with current schedules and transit information.

## Features

- Real-time transit data integration
- Authentic Solari board visual and animation effects
- 3js model of the iconic grand central clock
- Responsive design for different screen sizes

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/grand-central-digital-solari.git
cd grand-central-digital-solari

# Install dependencies
npm install
```

## Usage

Start the development server:

```bash
npm run dev
```

Then open your browser and navigate to `http://localhost:3000` (or the port shown in your terminal).

## Data Updates

The application relies on MTA transit data. If route or stop IDs change in the future, use the provided utility script to update the constants:

```bash
python update_gtfs_data.py
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
