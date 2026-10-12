# Smart Wall Paint Visualizer (MEAN stack) - final version

## If you already have the project running (update only the design)
Close the old terminals first, then:

```powershell
# 1. copy the new frontend files over your existing frontend
Copy-Item -Recurse -Force "C:\Users\diya\Downloads\wall-paint-visualizer-final\paint-visualizer\frontend-files\src\*" "C:\Users\diya\Downloads\wall-paint-visualizer\paint-visualizer\frontend\src\"

# 2. terminal 1 - backend
cd C:\Users\diya\Downloads\wall-paint-visualizer\paint-visualizer\backend
npm run dev

# 3. terminal 2 - frontend (click the + in the terminal panel)
cd C:\Users\diya\Downloads\wall-paint-visualizer\paint-visualizer\frontend
ng serve
```
Open http://localhost:4200 and press Ctrl+F5. Login: admin@paint.com / admin123

## Fresh setup on a new computer
```powershell
cd paint-visualizer\backend
npm install
copy .env.example .env      # then put your MongoDB Atlas link in MONGO_URI
npm run seed
npm run dev

# new terminal
cd paint-visualizer
npm i -g @angular/cli
ng new frontend --routing --style=scss --standalone --ssr=false
cd frontend
npm install --legacy-peer-deps
Remove-Item -Recurse -Force src\app, src\main.ts, src\styles.scss
Copy-Item -Recurse -Force ..\frontend-files\src\* src\
ng serve
```

## API
POST /api/auth/register, /api/auth/login | GET /api/colors, /api/patterns (user) | POST/PUT/DELETE colors, patterns (admin)
GET/POST/PUT/DELETE /api/projects (owner) | GET /api/admin/stats, /projects, /users (admin)

## Deploy
Atlas (database) + Render/Railway (backend) + Netlify/Vercel (frontend).
Change `API` in frontend/src/app/core/api.service.ts to the deployed backend URL, then `ng build`.
