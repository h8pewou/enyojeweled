# Deployment Guide

This guide will help you deploy the Enyo Bejeweled game on a web server.

## Prerequisites

- A web server (nginx, Apache, etc.)
- Git
- Node.js and npm (for building)
- Bower (for Enyo dependency)

## Step 1: Clone and Build

```bash
# Clone the repository
git clone https://github.com/yourusername/enyojeweled.git
cd enyojeweled

# Install dependencies
npm install
bower install
```

## Step 2: Create Deployment Directory

Create a directory structure like this:
```
deploy/
├── index.html
├── styles.css
├── src/
│   ├── App.js
│   └── kinds.js
└── bower_components/
    └── enyo/
        ├── enyo.js
        ├── loader.js
        └── ... (other Enyo files)
```

## Step 3: Copy Required Files

```bash
# Create deploy directory
mkdir deploy

# Copy essential files
cp index.html deploy/
cp styles.css deploy/
cp -r src deploy/
cp -r bower_components/enyo deploy/bower_components/
```

## Step 4: Configure Web Server

### For nginx:

1. Create a new server configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/deploy;
    index index.html;

    # Proper MIME types
    include /etc/nginx/mime.types;
    types {
        application/javascript js;
        text/css css;
    }

    # Handle all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

2. Test and reload nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### For Apache:

1. Create a `.htaccess` file in your deploy directory:
```apache
# Enable rewrite engine
RewriteEngine On

# Set proper MIME types
AddType application/javascript .js
AddType text/css .css

# Handle all routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L]

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico)$">
    Header set Cache-Control "max-age=2592000, public, no-transform"
</FilesMatch>
```

2. Enable required modules:
```bash
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2
```

## Step 5: Verify Deployment

1. Check that all files are accessible:
   - `http://your-domain.com/index.html`
   - `http://your-domain.com/bower_components/enyo/enyo.js`
   - `http://your-domain.com/src/kinds.js`
   - `http://your-domain.com/src/App.js`
   - `http://your-domain.com/styles.css`

2. Check browser console for any 404 errors

3. Verify MIME types:
   - JavaScript files should be served as `application/javascript`
   - CSS files should be served as `text/css`

## Common Issues and Solutions

1. **404 Errors for Enyo files**
   - Verify the `bower_components/enyo` directory is copied correctly
   - Check file permissions
   - Ensure paths in `index.html` are correct

2. **MIME Type Errors**
   - Ensure your web server is configured to serve `.js` files as `application/javascript`
   - Check that `.css` files are served as `text/css`

3. **CORS Issues**
   - If hosting on a subdomain, ensure proper CORS headers are set
   - Add to nginx config:
     ```nginx
     add_header Access-Control-Allow-Origin *;
     ```

4. **Path Issues**
   - If using a subdirectory, update paths in `index.html`:
     ```html
     <script src="/subdirectory/bower_components/enyo/enyo.js"></script>
     ```

## Testing Locally

Before deploying to production, test locally:

```bash
# Using Python's built-in server
python -m http.server 8080

# Or using Node's http-server
npx http-server deploy -p 8080
```

Visit `http://localhost:8080` to verify everything works.

## Security Considerations

1. Set proper file permissions:
```bash
find deploy -type f -exec chmod 644 {} \;
find deploy -type d -exec chmod 755 {} \;
```

2. Consider adding security headers:
```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
```

## Maintenance

1. Keep Enyo updated:
```bash
cd /path/to/source
bower update enyo
cp -r bower_components/enyo /path/to/deploy/bower_components/
```

2. Monitor server logs for errors:
```bash
# nginx
tail -f /var/log/nginx/error.log

# Apache
tail -f /var/log/apache2/error.log
``` 