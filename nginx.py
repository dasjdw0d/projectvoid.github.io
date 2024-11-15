import http.server
import socketserver
import os
import webbrowser
from urllib.parse import urlparse

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Translate URL paths to local filesystem paths
        path = urlparse(path).path
        return os.path.join('web_server', path.lstrip('/'))
    
    def end_headers(self):
        # Enable CORS for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def start_server(port=8000):
    try:
        # Change to the script's directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Ensure web_server directory exists
        if not os.path.exists('web_server'):
            print("Error: 'web_server' directory not found!")
            return

        handler = CustomHandler
        httpd = socketserver.TCPServer(("", port), handler)
        
        print(f"\nServer started at http://localhost:{port}")
        print("Press Ctrl+C to stop the server...")
        
        # Open the website in the default browser
        webbrowser.open(f'http://localhost:{port}')
        
        # Start the server
        httpd.serve_forever()
        
    except OSError as e:
        if e.errno == 98:  # Port already in use
            print(f"Port {port} is already in use. Trying another port...")
            start_server(port + 1)
        else:
            print(f"Error: {e}")
    except KeyboardInterrupt:
        print("\nShutting down the server...")
        httpd.shutdown()
        httpd.server_close()
        print("Server stopped")

if __name__ == '__main__':
    start_server()
