USGS Earthquake Data Visualization
Overview
The United States Geological Survey (USGS) is responsible for providing scientific data on natural hazards, ecosystems, climate change, and land use. While the USGS collects vast amounts of earthquake data from around the world, they currently lack an effective way to visualize it.

This project aims to develop an interactive web-based tool to display real-time earthquake data in a meaningful way. The visualization will help educate the public, inform government organizations, and support efforts to secure funding for critical research on natural hazards.

Features
✅ Interactive Map – Uses Leaflet.js to display earthquake occurrences on a dynamic map.
✅ Multiple Base Maps – Users can switch between satellite, topography, grayscale, and water color views.
✅ Tectonic Plate Data – Overlays tectonic plate boundaries to highlight seismic activity patterns.
✅ Magnitude & Depth Indicators – Earthquakes are represented as color-coded circles where:

Color represents depth (deeper earthquakes appear in different shades).
Size represents magnitude (larger circles for stronger quakes).
✅ Popup Information – Clicking an earthquake marker shows detailed information including:
Magnitude
Depth
Location
✅ Legend & Controls – A legend explains the color-coded depth levels, and a layer control toggles data overlays.
Technologies Used
JavaScript (with ES6+ features)
Leaflet.js (for mapping)
D3.js (for fetching and parsing GeoJSON data)
OpenStreetMap & USGS (for base layers and earthquake data)
Data Sources
USGS Earthquake API – https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
Tectonic Plate Boundaries – GitHub (Fraxen)
Installation & Usage
Clone the repository:
bash
Copy
Edit
git clone https://github.com/your-repo/usgs-earthquake-visualization.git
cd usgs-earthquake-visualization
Open index.html in a web browser.
Explore the map, switch layers, and click markers for details.
Future Improvements
🔹 Real-time data streaming (fetch data at regular intervals).
🔹 Historical earthquake data comparison (past vs. present trends).
🔹 Integration with weather and tsunami alerts.
🔹 Enhanced UI with user customization options.
