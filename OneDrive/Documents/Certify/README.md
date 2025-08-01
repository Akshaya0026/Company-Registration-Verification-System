# Certify - Digital Certificate Management System

![Certify Logo](https://img.shields.io/badge/Certify-Digital%20Certificate%20Wallet-6366F1)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

Certify is a full-stack web application that helps professionals manage, organize, and share their certificates and credentials. With an intuitive interface and powerful features, Certify makes it easy to keep track of your professional achievements and share them with your network.

## Features

### Certificate Management
- **Store & Organize**: Securely store all your certificates in one place
- **Track Expiration**: Get notified about expiring certificates
- **Tag System**: Categorize certificates with custom tags
- **PDF Support**: Upload and store PDF versions of your certificates

### Sharing Capabilities
- **Social Sharing**: Share certificates on LinkedIn, Twitter, Email, and WhatsApp
- **LinkedIn Integration**: Share as post with detailed certificate information or as document
- **Custom URLs**: Generate shareable links to your certificates

### Data Management
- **Import/Export**: Bulk import certificates from CSV or JSON files
- **Export Options**: Export your certificate collection in various formats
- **Statistics**: View insights about your certificate collection

### User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme
- **Animations**: Smooth transitions and interactions

## Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Router**: For navigation and routing
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication mechanism
- **Multer**: File upload handling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/certify.git
   cd certify
   ```

2. Install backend dependencies
   ```bash
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Start the development servers
   - Backend: In the root directory
     ```bash
     npm run dev
     ```
   - Frontend: In the frontend directory
     ```bash
     npm run dev
     ```

6. Access the application at `http://localhost:5173`

## Usage

### Account Management
1. **Register**: Create a new account with your email
2. **Login**: Access your certificate wallet
3. **Profile**: Update your personal information and password

### Certificate Operations
1. **Add Certificate**: Create a new certificate entry with details like title, issuer, dates, and tags
2. **Upload PDF**: Attach the original PDF certificate to your entry
3. **Edit/Delete**: Modify or remove certificates as needed
4. **View Details**: See comprehensive information about each certificate

### Sharing
1. **Generate Link**: Create a shareable URL for your certificate
2. **Social Share**: Directly share to platforms like LinkedIn, Twitter, etc.
3. **Export PDF**: Download and share the PDF version

### Import/Export
1. **Bulk Import**: Add multiple certificates at once via CSV or JSON
2. **Export Collection**: Download your entire certificate collection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React Icons](https://react-icons.github.io/react-icons/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)