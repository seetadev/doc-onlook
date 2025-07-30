# Doc Onlook

A Universal Windows Platform (UWP) companion app that enables seamless document viewing across your local network. Push documents from any machine on your network to view them instantly on your Windows device.

## 🚀 Features

- **Cross-platform Document Sharing**: Send documents from any device with a web browser to your UWP app
- **Multiple File Format Support**: View PDFs, images (JPG), text files, HTML content, and CSV data
- **Network Discovery**: Automatic device discovery on local networks
- **Voice Commands**: Cortana integration with voice commands like "Show my latest file"
- **Real-time File Transfer**: Instant document transfer over HTTP on port 2112
- **Sample File Collection**: Built-in sample files including "The Art of War" text, nature images, and demo PDFs
- **CSV Data Parsing**: Dedicated CSV parser for structured data viewing
- **Background Processing**: Background listener service for continuous file reception

## 🛠️ Tech Stack

### Frontend/UI
- **XAML**: Modern Windows UI markup language
- **C#**: Primary application logic language
- **Universal Windows Platform (UWP)**: Windows 10/11 native app framework

### Backend/Services
- **HTTP Server**: Custom HTTP server on port 2112
- **JSON Communication**: RESTful API for file transfer
- **Background Tasks**: Windows background service integration

### Web Integration
- **JavaScript Client**: Browser-based file sender (`doc-onlook.js`)
- **jQuery**: AJAX-based communication with UWP app
- **HTML Interface**: Web-based file selection and sending interface

### Development Tools
- **Visual Studio**: Primary IDE (solution file included)
- **MSBuild**: Build system for UWP applications
- **NuGet**: Package management via project.json
- **.NET Native**: Runtime optimization for UWP deployment

### Platform Features
- **Cortana Integration**: Voice command support via VoiceCommands XML
- **Windows Store**: Configured for Microsoft Store deployment
- **Adaptive Icons**: Multiple resolution app icons for different screen sizes

## 📁 Project Structure

```
doc-onlook/
├── Assets/                     # App icons and visual assets
├── Properties/                 # Assembly info and runtime directives
├── SampleFiles/               # Demo content (Art of War, images, PDFs)
├── Sender Sample/             # Web-based sender interface
│   ├── doc-onlook.js         # JavaScript client library
│   ├── testfile.html         # Demo sender interface
│   └── sample files          # Test documents
├── App.xaml                   # Application entry point
├── MainPage.xaml             # Primary UI layout
├── BackgroundListener.cs      # Network listener service
├── CsvParser.cs              # CSV file processing
├── DocOnlookCommands.xml     # Cortana voice commands
└── Package.appxmanifest      # UWP app manifest
```

## 🔧 Installation & Setup

### Prerequisites
- **Windows 10/11**: Version 1903 or later
- **Visual Studio 2019/2022**: With UWP development workload
- **Windows 10 SDK**: Latest version
- **Developer Mode**: Enabled in Windows Settings

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/anisharma07/doc-onlook.git
cd doc-onlook
```

2. **Open in Visual Studio**
```bash
# Open the solution file
start doc-onlook.sln
```

3. **Restore packages**
```bash
# In Package Manager Console
Update-Package -reinstall
```

4. **Build and deploy**
```bash
# Set target platform (x86, x64, or ARM)
# Build -> Deploy Solution
```

## 🎯 Usage

### Running the UWP App

1. **Deploy to local machine**
```bash
# In Visual Studio: Debug -> Start Debugging (F5)
# Or: Debug -> Start Without Debugging (Ctrl+F5)
```

2. **Enable network permissions**
   - The app will request network access permissions on first run
   - Allow access to private networks

### Sending Documents from Web Browser

1. **Set up the sender**
```html
<!-- Include the JavaScript client -->
<script src="http://code.jquery.com/jquery-2.2.0.min.js"></script>
<script src="doc-onlook.js"></script>
```

2. **Send a document**
```javascript
// Send a file to the UWP app
docOnlookSend(
    "MyDocument.pdf",           // File name
    ".pdf",                     // File type
    fileDataBase64,             // File content (base64)
    "192.168.1.100",           // UWP app IP address
    function(response) {        // Success callback
        console.log("File sent successfully!");
    },
    function(error) {           // Error callback
        console.log("Transfer failed");
    }
);
```

3. **Discover devices**
```javascript
// Find Doc Onlook devices on network
docOnlookFind(
    "192.168.1.100",           // Target IP
    function(response) {        // Success - device found
        console.log("Doc Onlook device found!");
    },
    function(error) {           // Device not found
        console.log("No devices found");
    }
);
```

### Voice Commands

With Cortana enabled:
- *"Hey Cortana, tell Doc Onlook to show my latest file"*
- *"Hey Cortana, ask Doc Onlook to open my latest file"*

## 📱 Platform Support

- **Windows 10**: Version 1903+ (Build 18362+)
- **Windows 11**: Full compatibility
- **Architecture**: x86, x64, ARM, ARM64
- **Device Family**: Universal (Desktop, Tablet, Mobile)
- **Network**: Local network (Wi-Fi/Ethernet)

## 🧪 Testing

### Using Sample Files
The app includes test content in `SampleFiles/`:
- `ArtOfWar.txt` - Text document
- `Books.csv` - CSV data sample  
- `Lake.jpg` & `Mountains.jpg` - Image samples
- `Sample PDF.pdf` - PDF document

### Web Sender Testing
Use the included `testfile.html` in `Sender Sample/` directory:
1. Open `testfile.html` in a web browser
2. Enter the UWP app's IP address
3. Select file type and content
4. Click send to transfer

## 🔄 Deployment

### Microsoft Store Deployment
1. **Package the app**
```bash
# Project -> Store -> Create App Packages
# Follow the packaging wizard
```

2. **Upload to Partner Center**
   - Use the generated `.appxupload` file
   - Complete store listing and certification

### Sideloading
```bash
# Generate test certificate
# Package -> Create App Packages -> Sideloading
# Install the generated .appx package
```

## 📊 Performance & Optimization

- **Background Processing**: Efficient network listener with minimal battery impact
- **Memory Management**: Optimized file handling for large documents  
- **.NET Native**: Compiled for native performance
- **Network Efficiency**: Compressed JSON payloads for faster transfers

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow C# coding conventions
- Test on multiple Windows versions
- Ensure XAML UI follows UWP design guidelines
- Validate network functionality across different network configurations
- Update voice commands in `DocOnlookCommands.xml` for new features

## 📄 License

This project is licensed under the ISC License. See the repository for more details.

## 🙏 Acknowledgments

- Built with Universal Windows Platform (UWP)
- jQuery for cross-platform web integration  
- Sample content includes public domain texts
- Icons designed for Windows design language

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/anisharma07/doc-onlook/issues)
- **Repository**: [https://github.com/anisharma07/doc-onlook](https://github.com/anisharma07/doc-onlook)
- **Platform**: Universal Windows Platform

---

*Doc Onlook - Bridging the gap between your devices for seamless document viewing.*