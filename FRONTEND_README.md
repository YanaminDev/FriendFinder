# 🎨 FriendFinder Frontend ภาษาไทย

Frontend สร้างด้วย **React + Vite + TailwindCSS**

---

## 📂 โครงสร้างโปรเจค

```
frontend/src/
├── main.tsx                      # จุดเริ่มต้นแอป
├── App.tsx                       # Component หลัก (ครอบ AuthProvider + Router)
├── index.css                     # CSS global
│
├── apis/                         # 🔌 API ติดต่อกับ Backend
│   ├── main.api.ts              # Axios ตั้งค่า + ดักจับ request/response
│   └── endpoint.api.ts          # URL ของ API ทั้งหมด
│
├── services/                     # 🔧 ตัวช่วยเรียก API (11 services)
│   ├── auth.service.ts          # login, register, logout
│   ├── user.service.ts          # แก้ไขข้อมูลผู้ใช้
│   ├── location.service.ts      # จัดการสถานที่
│   ├── activity.service.ts      # ดึงรายการกิจกรรม
│   ├── position.service.ts      # ค้นหาตำแหน่ง
│   ├── map.service.ts           # รับ token ของ Mapbox
│   ├── admin.service.ts         # ฟังก์ชัน admin
│   ├── lookup.service.ts        # ดึงข้อมูลจำพวก (ดื่มสุรา, ออกกำลัง, ฯลฯ)
│   ├── userInformation.service.ts
│   ├── userLifeStyle.service.ts
│   └── feedback.service.ts
│
├── types/                        # 📝 Type ของ TypeScript
│   ├── requests/                # Type ของข้อมูลส่งไป Backend
│   │   └── index.ts            # LoginRequest, RegisterRequest ฯลฯ
│   └── responses/               # Type ของข้อมูลรับจาก Backend
│       └── index.ts            # UserResponse, LocationResponse ฯลฯ
│
├── utils/                        # 🛠️ ฟังก์ชันช่วยเหลือ
│   ├── api.ts                  # รีเฟรช token + เรียก API
│   └── ionicon.tsx             # โปรแกรมแสดง icon
│
├── context/                      # 🌍 สเตท Global (Context API)
│   └── AuthContext.tsx         # ข้อมูลการ login/logout
│
├── zustand/                      # 🏪 เก็บข้อมูล (Zustand)
│   └── useAuthStore.ts         # เก็บข้อมูล login (ทั่วแอป)
│
├── components/                   # 🎨 Reusable UI (21 ไฟล์)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Select.tsx
│   ├── ImageCarousel.tsx
│   ├── SearchBar.tsx
│   ├── TimeInput.tsx
│   ├── DateRangePicker.tsx
│   ├── TopBar.tsx
│   ├── BottomNav.tsx
│   ├── logo.tsx
│   ├── common/
│   │   └── AdminRoute.tsx      # ป้องกันหน้า (ผู้ใช้ต่อเฉพาะ admin)
│   └── ... (13 ตัวอื่น)
│
├── layout/                       # 📐 Layout
│   ├── PageWrapper.tsx          # Wrapper หลัก
│   └── AuthLayout.tsx           # Layout สำหรับหน้า login
│
├── pages/                        # 📄 หน้าต่างๆ (7 หน้า)
│   ├── LoginPage.tsx            # หน้า login
│   ├── RegisterPage.tsx         # หน้า register
│   ├── ForgotPasswordPage.tsx   # หน้า ลืม password
│   ├── HomePage.tsx             # หน้า home (admin only)
│   ├── UserPage.tsx             # หน้า ผู้ใช้ (admin only)
│   ├── AddDataPage.tsx          # หน้า เพิ่มข้อมูล (admin only)
│   └── FeedbackPage.tsx         # หน้า feedback (admin only)
│
├── features/                     # ⭐ ฟีเจอร์ใหญ่ (complex features)
│   ├── auth/                    # ฟีเจอร์ login/register
│   ├── login/                   # ฟีเจอร์ login
│   ├── user/                    # ฟีเจอร์ จัดการผู้ใช้
│   ├── home/                    # ฟีเจอร์ หน้าแรก
│   ├── location/                # ฟีเจอร์ สถานที่
│   ├── map/                     # ฟีเจอร์ แผนที่
│   ├── Position/                # ฟีเจอร์ ตำแหน่ง
│   ├── adddata/                 # ฟีเจอร์ เพิ่มข้อมูล
│   ├── feedback/                # ฟีเจอร์ ฟีดแบก
│   └── footer/                  # ท้ายหน้า
│
├── hooks/                        # 🪝 Custom Hooks (6 hooks)
│   ├── useAuth.ts              # ใช้ Auth
│   ├── useUser.ts              # ใช้ User
│   ├── useLocation.ts          # ใช้ Location
│   ├── useActivity.ts          # ใช้ Activity
│   ├── useActivities.ts        # ใช้ Activities
│   └── useMap.ts               # ใช้ Map
│
├── app/                         # ⚙️ ตั้งค่าแอป
│   └── router.tsx              # กำหนด URL route
│
├── constants/                   # ⚠️ EMPTY (ไม่ใช้)
│
├── schemas/                     # ⚠️ UNUSED (ไม่ใช้)
│   └── auth.schema.ts          # ไม่นำมาใช้
│
└── assets/
    └── react.svg               # React logo
```

---

## 🔄 Flow ของแอป

### Flow เรียก API ทั่วไป

```
หน้า (Page) หรือ Feature
  ↓ เรียก service
Service (auth.service.ts, user.service.ts ฯลฯ)
  ├─ เตรียมข้อมูล
  └─ เรียก API
  ↓
API Layer (main.api.ts - Axios)
  ├─ เพิ่ม Authorization header
  ├─ ส่ง request ไป Backend
  └─ ถ้า response 401 → รีเฟรช token แล้วลองใหม่
  ↓
Backend ตอบกลับ
  ↓
Service ประมวลผลข้อมูล
  ↓
หน้า อัปเดต UI
```

### Flow LOGIN หลัก

ลองดู **Actual Code** จาก `LoginPage.tsx`:

```typescript
// 1. User กรอก username + password ใน form
// 📁 features/login/Login.tsx
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });  // ← เรียก hook
    navigate("/home");  // ← ไปหน้า home
};

// 2. Hook useAuth ดำเนินการ
// 📁 hooks/useAuth.ts
const login = async (credentials: LoginRequest) => {
    try {
        const response = await authService.login(credentials);
        // ← เรียก service
        
        // 3. Service เรียก Backend API
        // 📁 services/auth.service.ts
        // POST /v1/api/auth/login
        
        // 4. Backend ตอบกลับ:
        // {
        //   username: "john",
        //   user_id: "550e8400...",
        //   accessToken: "eyJhbGc...",
        //   role: "admin"
        // }
        
        // 5. Hook บันทึก Token
        setAuth(true, response.username, response.user_id, response.accessToken);
        contextLogin(response.accessToken, ...);
        
        // ✅ Login เสร็จ
        return response;
    } catch (err) {
        setError(error.message);  // ← แสดง error
    }
};
```

### Flow แผนที่ (Map)

ลองดู **Actual Code** จาก `MapView.tsx`:

```typescript
// 📁 features/map/MapView.tsx
const MapView: React.FC<MapProps> = ({ className = '', onLocationClick }) => {
  useEffect(() => {
    // 1. เมื่อ Component โหลด
    // ↓ เรียก mapService เพื่อได้ Mapbox token
    mapService.getToken()
      .then(token => {
        if (token) {
          mapboxgl.accessToken = token;  // ← ตั้ง token
          setTokenLoaded(true);
        }
      })
      .catch(err => console.error('Failed to load token:', err));
  }, []);

  useEffect(() => {
    if (!tokenLoaded || !mapContainer.current) return;

    // 2. เมื่อ token พร้อม ให้สร้าง map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [100.543627, 13.865072],  // ← พิกัดกรุงเทพ
      zoom: 12,
    });

    // 3. เพิ่ม Marker ไปยังแต่ละสถานที่
    const locations: LocationData[] = [
      {
        id: '1',
        name: 'The Mall',
        latitude: 13.6919,
        longitude: 100.5581,
        tags: ['Cinema', 'Karaoke']
      }
    ];

    locations.forEach(location => {
      const marker = new mapboxgl.Marker({...})
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current);
    });
  }, [tokenLoaded]);

  return <div ref={mapContainer} />;
};
```

**สรุป Map Flow:**
1. Map Component โหลด → เรียก `mapService.getToken()`
2. Service ส่ง GET /v1/map/token ไป Backend
3. Backend ตอบ token → บันทึก
4. Render Map บน Canvas ด้วย Mapbox library
5. เพิ่ม Marker ของสถานที่บนแผนที่

---

## 🎯 Services อธิบายสั้นๆ (ตัวช่วยเรียก API)

| Service | ทำอะไร | โค้ดตัวอย่าง |
|---------|--------|-------------|
| **auth** | login, register, logout | `await authService.login({username, password})` |
| **user** | เปลี่ยนข้อมูลผู้ใช้ | `await userService.updateProfile({age: 25})` |
| **location** | จัดการสถานที่ | `await locationService.create({name, latitude, longitude})` |
| **activity** | ดึงรายการกิจกรรม | `await activityService.getAll()` |
| **position** | ค้นหาตำแหน่ง | `await positionService.searchNearby(lat, lng)` |
| **map** | ขอ token Mapbox | `await mapService.getToken()` |
| **admin** | ฟังก์ชัน admin | `await adminService.getAllUsers()` |
| **lookup** | ดึงข้อมูล (ดื่มสุรา, ออกกำลัง) | `await lookupService.getAll()` |

---

## 📋 Types (Type ของข้อมูล)

### Request Type - ส่งไป Backend

```typescript
// 📁 types/requests/index.ts
interface LoginRequest {
  username: string;
  password: string;
}

interface CreateLocationRequest {
  name: string;
  activity_id: string;
  latitude: number;
  longitude: number;
}
```

### Response Type - รับจาก Backend

```typescript
// 📁 types/responses/index.ts
interface AuthResponse {
  accessToken: string;
  username: string;
  user_id: string;
  role: string;
}

interface UserResponse {
  user_id: string;
  username: string;
  age: number;
  interested_gender: 'male' | 'female' | 'lgbtq';
}
```

---

## 🛠️ Utilities อธิบายสั้นๆ

### `main.api.ts` - Axios ตั้งค่า
```typescript
// 📁 apis/main.api.ts

// ✅ ทำอะไร:
// 1. เรียก API ด้วย Axios
// 2. เพิ่ม Authorization header (token)
// 3. ถ้า response 401 → รีเฟรช token แล้วลองใหม่
// 4. ถ้า response 403 → redirect ไป login

// ✅ ใช้ยังไง:
import axiosInstance from '../apis/main.api';
const response = await axiosInstance.get('/v1/user/profile');
```

### `AuthContext.tsx` - เก็บ login info
```typescript
// 📁 context/AuthContext.tsx

// ✅ ทำอะไร:
// เก็บข้อมูล login (isAuthenticated, username, role ฯลฯ)
// ทั่วแอป ไม่ต้อง pass props ไปมา

// ✅ ใช้ยังไง:
const { isAuthenticated, username, login, logout } = useAuth();
```

### `useAuth.ts` - Hook ช่วยเรียก API
```typescript
// 📁 hooks/useAuth.ts

// ✅ ทำอะไร:
// รวม login, register, logout logic ไว้ที่เดียว

// ✅ ใช้ยังไง:
const { login, error, loading } = useAuth();
await login({ username, password });
```

---

## 📄 หน้าต่างๆ (Pages)

| หน้า | URL | ทำอะไร |
|-----|-----|--------|
| **LoginPage** | `/login` | หน้า login |
| **RegisterPage** | `/register` | หน้า register |
| **ForgotPasswordPage** | `/forgot-password` | ลืม password |
| **HomePage** | `/home` | 🔒 หน้าแรก (admin only) |
| **UserPage** | `/user` | 🔒 ผู้ใช้ (admin only) |
| **AddDataPage** | `/adddata` | 🔒 เพิ่มข้อมูล (admin only) |
| **FeedbackPage** | `/feedback` | 🔒 feedback (admin only) |

🔒 = ต้องเป็น admin ถึงเข้าได้

---

## 🎨 ตัวอย่าง: Login Flow เต็มๆ

```
┌──────────────────────┐
│ LoginPage.tsx        │
│ (หน้า login)         │
└──────────┬───────────┘
           │ ผู้ใช้กรอก username/password
           │ และกด "Login"
           ↓
┌──────────────────────────────────────┐
│ features/login/Login.tsx             │
│ const handleSubmit = async (e) => {  │
│   await login({username, password}); │ ← เรียก hook
│   navigate("/home");                 │
│ }                                    │
└──────────┬───────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────┐
│ hooks/useAuth.ts                        │
│ const login = async (credentials) => {  │
│   const response =                      │
│     await authService.login(credentials)│ ← เรียก service
│   setAuth(...);                         │
│ }                                       │
└──────────┬──────────────────────────────┘
           │
           ↓
┌────────────────────────────────────────────┐
│ services/auth.service.ts                   │
│ export const authService = {               │
│   async login(data) {                      │
│     const response = await                 │
│       axiosInstance.post(AUTH_LOGIN, data);│ ← เรียก API
│     return response.data;                  │
│   }                                        │
│ }                                          │
└──────────┬─────────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────────┐
│ apis/main.api.ts (Axios)                     │
│                                              │
│ POST /v1/api/auth/login                      │ ← HTTP request
│ {                                            │
│   username: "john",                          │
│   password: "pass123"                        │
│ }                                            │
│                                              │
│ + Add Authorization header (token)           │
│ + Handle response                            │
└──────────┬───────────────────────────────────┘
           │ ส่ง HTTP request ไป Backend
           ↓
   ┌─────────────────┐
   │ Backend (3000)  │
   └─────────────────┘
           │ ตอบกลับ
           ↓
┌──────────────────────────────────────────────┐
│ Backend Response (200 OK)                    │
│ {                                            │
│   username: "john",                          │
│   user_id: "550e...",                       │
│   accessToken: "eyJhbGc...",                │
│   role: "admin"                             │
│ }                                            │
└──────────┬───────────────────────────────────┘
           │
           ↓
┌────────────────────────────────────────┐
│ useAuth.ts จัดเก็บข้อมูล              │
│ • localStorage.setItem('accessToken') │
│ • AuthContext.login()                │
│ • useAuthStore.setAuth()             │
└────────────┬───────────────────────────┘
             │
             ↓
┌──────────────────────────┐
│ LoginPage                │
│ navigate("/home")        │ ← ไปหน้า home
└──────────────────────────┘
             │
             ↓
        ✅ LOGIN COMPLETE
        user ทะลวงเข้ามา
```

---

## 🎨 ตัวอย่าง: Map Flow

```
┌──────────────────┐
│ MapView.tsx      │
│ (หน้าแผนที่)     │
└────────┬─────────┘
         │ Component โหลด
         ↓
┌──────────────────────────────────────┐
│ useEffect(() => {                    │
│   mapService.getToken()    ← เรียก  │
│     .then(token => {                 │
│       mapboxgl.accessToken = token;  │
│       setTokenLoaded(true);          │
│     })                               │
│ }, [])                               │
└────────┬─────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│ services/map.service.ts              │
│ async getToken() {                   │
│   const response = await             │
│     axiosInstance.get(MAP_GET_TOKEN);│ ← GET /v1/map/token
│   return response.data.token;        │
│ }                                    │
└────────┬────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ Backend ตอบ:                            │
│ {                                        │
│   token: "pk.eyJ1IjoiZnJpZW5k..."      │
│ }                                        │
└────────┬─────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────┐
│ mapService ส่ง token กลับ              │
│ ↓                                      │
│ useEffect ตัวที่ 2:                   │
│ mapboxgl.accessToken = token;         │
│ map.current = new mapboxgl.Map({      │
│   container: mapContainer,             │
│   style: 'mapbox://styles/...',       │
│   center: [100.5, 13.7],              │
│   zoom: 12                            │
│ });                                   │
│                                        │
│ + เพิ่ม Marker ของสถานที่             │
└────────────────────────────────────────┘
         │
         ↓
   ✅ MAP DISPLAYED
   เห็นแผนที่พร้อม Marker

---

## ⚠️ ไฟล์ที่ไม่ใช้ (ลบได้)

### 1. `frontend/src/services/mapService.ts` 
- **ปัญหา:** มี map service ซ้ำสองไฟล์
  - ✅ ใช้: `map.service.ts`
  - ❌ ไม่ใช้: `mapService.ts` (ชื่อไม่ตรงกับรูปแบบ)
- **วิธีแก้:** ลบ `mapService.ts` ไป
- **หมายเหตุ:** Code ทั้งสองไฟล์เหมือนกัน แค่ชื่อต่างกัน

### 2. `frontend/src/schemas/auth.schema.ts`
- **ปัญหา:** ไฟล์นี้ไม่ถูก import ที่ไหนเลย
  ```typescript
  // schema ถูก export แต่ไม่มีใครใช้
  export const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
  });
  ```
- **วิธีแก้:** ลบ `schemas/auth.schema.ts` ไป
- **หมายเหตุ:** validation ทำใน component ตรงๆแล้ว

### 3. `frontend/src/constants/` (Folder เปล่า)
- **ปัญหา:** Folder เปล่า ไม่มีไฟล์ไหนอยู่
- **วิธีแก้:** ลบ folder ไป
- **หมายเหตุ:** constants ไม่จำเป็น ใช้ endpoint ใน `apis/endpoint.api.ts` แทน

---

## 🚀 วิธีใช้ Frontend

### 1. ติดตั้ง dependencies

```bash
cd frontend
npm install
```

### 2. รัน dev server

```bash
npm run dev
```

เปิด `http://localhost:5173`

### 3. Build production

```bash
npm run build
```

---

## 📌 Best Practices

### ✅ ทำแบบนี้

```typescript
// 1. ใช้ service เพื่อเรียก API
const response = await userService.updateProfile(data);

// 2. ใช้ useAuth hook ในการ login
const { login, loading } = useAuth();
await login(credentials);

// 3. ใช้ axiosInstance เมื่อจำเป็น
import axiosInstance from '@/apis/main.api';
const response = await axiosInstance.get('/endpoint');

// 4. ใช้ types ให้ถูกต้อง
const handleLogin = (data: LoginRequest) => {
  authService.login(data);
};
```

### ❌ ไม่ต้องทำแบบนี้

```typescript
// ❌ เรียก API โดยตรง
const response = await fetch('/api/user/profile');

// ❌ ใช้ plain password
localStorage.setItem('password', password);

// ❌ ไม่ระบุ type
const handleLogin = (data) => {  // data ไม่มี type
  authService.login(data);
};

// ❌ ใช้ localStorage โดยตรง
const token = localStorage.getItem('accessToken');
```

---

## 🔐 Security Notes

1. **Token Storage:** 
   - Access token เก็บใน localStorage
   - Refresh token เก็บใน localStorage
   - ⚠️ localStorage สามารถถูก XSS attack ได้

2. **CORS:**
   - อนุญาตเฉพาะ Backend URL

3. **Password:**
   - NEVER log password
   - NEVER store plain password

4. **Interceptor:**
   - Auto add Authorization header
   - Auto refresh token on 401

---

## 📚 Reference (อ่านเพิ่มเติม)

| ทำอะไร | ดูไฟล์ไหน |
|--------|----------|
| เรียก API Login | `services/auth.service.ts` |
| ใช้ Auth state | `hooks/useAuth.ts` |
| ป้องกันหน้า (admin only) | `components/common/AdminRoute.tsx` |
| ตั้ง Axios | `apis/main.api.ts` |
| View ทั้งหมด | `app/router.tsx` |
| Type ทั้งหมด | `types/` |

---

## 📊 สถิติ

- 🔧 Services: **11 ตัว**
- 📄 Pages: **7 หน้า**
- 🪝 Hooks: **6 ตัว**
- 🎨 Components: **21+ ตัว**
- ⭐ Features: **10 โมดูล**
- 📝 Types: **60+ types**
- ❌ ไฟล์ไม่ใช้: **3 ตัว** (แนะนำลบ)

---

## 💡 Quick Start

```typescript
// 1. Login
import { useAuth } from '@/hooks/useAuth';
const { login } = useAuth();
await login({ username: 'john', password: 'pass' });

// 2. Get user profile
import { userService } from '@/services';
const profile = await userService.getProfile();

// 3. Create location
import { locationService } from '@/services';
await locationService.create({
  name: 'Coffee Shop',
  latitude: 13.7,
  longitude: 100.5
});

// 4. Show map
import MapView from '@/features/map/MapView';
export default () => <MapView />;
```

---

## ❓ FAQ

**Q: ทำไม import จากไฟล์ไม่ทำงาน?**  
A: ตรวจสอบ path ใน `tsconfig.json` - ควร map `@` ไปที่ `src/`

**Q: Token หมดอายุแล้ว ทำไง?**  
A: Interceptor ใน `main.api.ts` จะ auto refresh token

**Q: อยากเพิ่ม service ใหม่ ทำไง?**  
A: สร้างไฟล์ `src/services/xxx.service.ts` ตามรูปแบบเดิม

**Q: ทำไมแล้ว build แล้ว reload หน้า?**  
A: Use `npm run dev` สำหรับ hot reload
```

---

## ⚙️ Configuration Files

```
frontend/
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # TailwindCSS config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS config
├── eslint.config.js            # ESLint rules
└── index.html                  # HTML entry point
```

### Environment Variables (.env)

```
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🔐 Authentication Flow

### Login
```
1. User goes to /login
2. Enters username + password
3. Click "Login"
4. Service calls: authService.login()
5. Backend validates + returns tokens
6. localStorage.setItem('accessToken', token)
7. AuthContext.login() → updates state
8. Router redirects to /home
```

### Token Refresh
```
1. API request made with old token
2. Backend returns 401 (token expired)
3. Response interceptor catches 401
4. Calls: refreshAccessToken()
5. Sends refreshToken to /v1/api/refresh
6. Gets new accessToken
7. Retries original request with new token
8. If refresh fails → redirect to /login
```

### Logout
```
1. User clicks logout
2. Calls: authService.logout()
3. Sends POST /logout
4. AuthContext.logout() clears tokens
5. localStorage.removeItem('accessToken')
6. Router redirects to /login
```

---

## 📱 Routes

```
Public Routes:
- /              → LoginPage
- /login         → LoginPage
- /register      → RegisterPage
- /forgot-password → ForgotPasswordPage

Admin-Only Routes (protected by AdminRoute):
- /home          → HomePage
- /user          → UserPage
- /feedback      → FeedbackPage
- /adddata       → AddDataPage

Fallback:
- /*             → 404 Not Found
```

---

## ⚠️ Unused Files

### 1. `src/services/mapService.ts`
- **Status:** ❌ NOT USED
- **Reason:** Placeholder file, use `map.service.ts` instead
- **Action:** Can be deleted

### 2. `src/schemas/auth.schema.ts`
- **Status:** ❌ NOT USED
- **Reason:** Not imported or referenced anywhere
- **Action:** Can be deleted (uses Zod validation but not integrated)

### 3. `src/constants/` folder
- **Status:** ❌ EMPTY
- **Reason:** No files in this folder
- **Action:** Keep or use for future constants

---

## 🎨 Component Structure

### Common Components (in `components/`)
```
UI Components:
- Button.tsx         → Reusable button
- Input.tsx          → Text input
- Select.tsx         → Dropdown
- Modal.tsx          → Modal dialog
- Card.tsx           → Card container
- SearchBar.tsx      → Search input

Layout Components:
- TopBar.tsx         → Header
- BottomNav.tsx      → Bottom navigation
- ActionTabs.tsx     → Tab navigation

Specialized:
- ImageCarousel.tsx  → Image slider
- DateRangePicker.tsx
- TimeInput.tsx
- PhoneInput.tsx
- IconPicker.tsx
- ConfirmDialog.tsx
- OptionItem.tsx
- CategoryCard.tsx
- CardHeader.tsx
- OpenDateSelect.tsx
- logo.tsx
```

---

## 🔗 API Integration Pattern

### Example: Create Location Service

```typescript
// 1. Define types (types/requests/index.ts)
export interface CreateLocationRequest {
  name: string;
  activity_id: string;
  latitude: number;
  longitude: number;
}

// 2. Add endpoint (apis/endpoint.api.ts)
export const LOCATION_CREATE = '/v1/location/create';

// 3. Create service (services/location.service.ts)
export const locationService = {
  async create(data: CreateLocationRequest) {
    const response = await axiosInstance.post(LOCATION_CREATE, data);
    return response.data;
  }
};

// 4. Use in component
import { locationService } from '../../services';
const result = await locationService.create(formData);
```

---

## 🐛 Common Debugging Tips

### API Calls Not Working?
1. Check Network tab (DevTools)
2. Verify Authorization header present
3. Check response status code
4. See response message

### Token Expired?
1. Check if refreshToken in localStorage
2. Check /refresh endpoint response
3. Monitor Network tab during refresh

### Component State Not Updating?
1. Check if AuthContext.Provider wraps all pages
2. Check useAuth() hook is called correctly
3. Verify context value updates

### CORS Error?
1. Check backend CORS middleware
2. Verify API_BASE_URL correct
3. Check credentials: true in axios

---

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| Pages | 7 |
| Services | 11 |
| Custom Hooks | 6 |
| Components | 21+ |
| Feature Modules | 10 |
| Types/Interfaces | 50+ |
| API Endpoints | 50+ |

---

## 🔧 Development Workflow

### Adding New Feature

```
1. Create types
   └─ frontend/src/types/responses/index.ts

2. Add endpoint constant
   └─ frontend/src/apis/endpoint.api.ts

3. Create service
   └─ frontend/src/services/newFeature.service.ts

4. Create component/page
   └─ frontend/src/components/ or frontend/src/pages/

5. Use in page
   └─ import service
   └─ call service in useEffect
   └─ handle response

6. Test
   └─ Check Network tab
   └─ Verify types match
```

### Debugging Checklist

```
□ API returns 401?
  └─ Check: localStorage has accessToken?
  └─ Check: Header Authorization present?

□ API returns 400?
  └─ Check: Request payload matches type?
  └─ Check: All required fields present?

□ Component doesn't re-render?
  └─ Check: State updated correctly?
  └─ Check: Component in right context provider?

□ CORS error?
  └─ Check: Backend CORS config
  └─ Check: API_BASE_URL correct
```

---

## 💡 Quick Tips

**Use Context for:**
- User authentication state
- Global user info (userId, username, role)

**Use Zustand for:**
- Complex state that needs middleware
- Persistent state across page refreshes

**Use Custom Hooks for:**
- Reusable API call logic
- Component lifecycle logic

**Use Services for:**
- All API integration
- Data transformation

---

**Last Updated:** April 2026  
**Frontend Version:** 1.0.0
