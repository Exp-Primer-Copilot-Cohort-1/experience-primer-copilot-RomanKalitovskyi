// Create web server
// Run: node comments.js
// Test: http://localhost:3000/comments?postId=1

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    const method = req.method;

    // Get all comments
    if (pathname === '/comments' && method === 'GET') {
        fs.readFile(path.join(__dirname, './comments.json'), 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    }

    // Add a comment
    if (pathname === '/comments' && method === 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            const comment = qs.parse(data);
            fs.readFile(path.join(__dirname, './comments.json'), 'utf-8', (err, comments) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' });
                    res.end('Server Error');
                } else {
                    comments = JSON.parse(comments);
                    comments.comments.push(comment);
                    fs.writeFile(path.join(__dirname, './comments.json'), JSON.stringify(comments), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' });
                            res.end('Server Error');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(comment));
                        }
                    });
                }
            });
        });
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});