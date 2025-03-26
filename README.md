# Work Time Tracker Chrome Extension

A simple and elegant Chrome extension to track your daily working hours and calculate your average work time.

## Features

- Track daily working hours
- Add multiple days at once
- View all time entries
- Calculate average working hours
- Clean and minimalist UI
- Data persistence using Chrome storage
- Easy to use interface

## Installation

### Method 1: Install from Chrome Web Store (Recommended)
1. Visit the Chrome Web Store link (coming soon)
2. Click "Add to Chrome"
3. Click "Add Extension" in the popup
4. The extension is now installed!

### Method 2: Install from Source Code
1. Clone this repository or download the source code
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension is now installed!

## Usage

1. Click the extension icon in your Chrome toolbar to open the popup
2. You'll see three tabs:
   - **Add Single Day**: Add today's working hours
   - **Add Multiple Days**: Add the same working hours for multiple days
   - **View All Entries**: See all your time entries

### Adding a Single Day Entry
1. Click "Add Single Day" tab
2. Enter hours and minutes
3. Click "Add Entry"
4. You'll see a notification confirming the entry was added

### Adding Multiple Days
1. Click "Add Multiple Days" tab
2. Enter the number of days
3. Enter hours and minutes
4. Click "Add Multiple Entries"
5. The entries will be added for the specified number of days

### Viewing Entries
1. Click "View All Entries" tab
2. You'll see a list of all your time entries
3. Each entry shows the date and time worked
4. You can delete individual entries using the delete button

### Clearing Data
- Click "Clear All Data" at the bottom to reset all entries
- This action cannot be undone

## Development

### Project Structure
```
work-time-tracker/
├── manifest.json      # Extension configuration
├── popup.html        # Main extension popup
├── popup.js         # Popup functionality
└── icons/           # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Building from Source
1. Clone the repository
2. Make your changes
3. Load the extension in Chrome using Developer mode
4. Test your changes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [icon source]
- Built with vanilla JavaScript and Chrome Extension APIs 