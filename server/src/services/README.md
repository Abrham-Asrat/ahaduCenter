# services/

Thin service helpers that encapsulate cross-cutting concerns.

---

## Files

### `notification.service.js`

```js
async createNotification({ userId, type, title, description })
```

Creates a `Notification` document. Called by:
- `borrowing.controller.js` → after a book is borrowed (`type: "Books"`)
- `order.controller.js` → after an order is placed (`type: "Electronics"`)
- `admin.controller.js` → after a movie request status is updated (`type: "Movies"`)

**Important**: all Mongoose operations are wrapped in `try/catch`. Errors are logged but **never re-thrown** — a notification failure must never roll back the primary operation (borrow, order, or status update).

---

### `upload.service.js`

```js
getFileUrl(filename)  // → "/uploads/<filename>"
```

Returns the public URL path for an uploaded file. The `uploads/` directory is created automatically by multer's `diskStorage` on first write and is served as static assets at `/uploads` by `app.js`.
