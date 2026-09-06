# 📥 HERMES Platform - Complete Application Download

## ⚡ Quick Download Links

### 🔗 Main Repository
**GitHub**: https://github.com/mamadesko9999-jpg/Mamad13

### 📦 Direct Download Options

#### Option 1: ZIP File
```
Download: https://github.com/mamadesko9999-jpg/Mamad13/archive/refs/heads/main.zip
Size: ~50MB
```

#### Option 2: Git Clone
```bash
git clone https://github.com/mamadesko9999-jpg/Mamad13.git
cd Mamad13
```

#### Option 3: Using GitHub CLI
```bash
gh repo clone mamadesko9999-jpg/Mamad13
cd Mamad13
```

---

## 🚀 Installation (5 Minutes)

### Step 1: Extract/Clone
```bash
# If using ZIP
unzip Mamad13-main.zip
cd Mamad13

# Or if using Git
git clone https://github.com/mamadesko9999-jpg/Mamad13.git
cd Mamad13
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment
```bash
cp .env.example .env.local

# Edit .env.local with your API keys:
# - FOOTBALL_DATA_API_KEY
# - STRIPE_SECRET_KEY
# - JWT_SECRET
# - Database credentials
```

### Step 4: Start Docker Services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Step 5: Run Migrations
```bash
npm run db:migrate
npm run db:seed
```

### Step 6: Start Application
```bash
npm run dev
```

---

## 🌐 Access Points

| Service | URL | Port |
|---------|-----|------|
| **Web App** | http://localhost:3000 | 3000 |
| **API** | http://localhost:3001 | 3001 |
| **API Docs** | http://localhost:3001/api/v1/docs | 3001 |
| **Grafana** | http://localhost:3002 | 3002 |
| **Prometheus** | http://localhost:9090 | 9090 |
| **Kibana** | http://localhost:5601 | 5601 |
| **n8n** | http://localhost:5678 | 5678 |
| **RabbitMQ** | http://localhost:15672 | 15672 |

---

## 📁 Project Structure

```
Mamad13/
├── frontend/                 # React + Next.js Web App
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── agents/          # 12 Agent Pipeline
│   │   ├── routes/          # API Routes
│   │   ├── services/        # Business Logic
│   │   └── models/          # Data Models
│   └── package.json
│
├── database/                 # PostgreSQL Schemas
│   ├── migrations/
│   └── seeds/
│
├── docker-compose.prod.yml   # Production Docker Setup
├── .env.example              # Environment Template
├── README.md                 # Full Documentation
└── package.json              # Root Package
```

---

## 💻 System Requirements

### Minimum
- Node.js 18+
- npm 9+
- Docker & Docker Compose
- 4GB RAM
- 10GB Disk Space

### Recommended
- Node.js 20+
- npm 10+
- Docker with 8GB RAM allocation
- SSD Storage
- 50GB Disk Space

---

## ✅ Features Included

### Backend (12-Agent Pipeline)
- ✅ Data Ingestion from 4+ sources
- ✅ Data Normalization & Validation
- ✅ Quality Checks (7 parameters)
- ✅ Duplicate Detection
- ✅ Data Enrichment
- ✅ Feature Engineering
- ✅ Prediction Models (A & B)
- ✅ Red Team Analysis
- ✅ 12-Step Audit
- ✅ Quality Filtering
- ✅ Database Storage

### Frontend
- ✅ React 18 + Next.js 14
- ✅ Real-time Match Updates
- ✅ 48-Hour Tournament Schedule
- ✅ Live Score Tracking
- ✅ Advanced Analytics
- ✅ User Authentication
- ✅ Multi-language (8+ languages)
- ✅ Mobile Responsive
- ✅ Dark/Light Mode

### Infrastructure
- ✅ PostgreSQL Multi-Region
- ✅ Redis Cluster
- ✅ Elasticsearch
- ✅ RabbitMQ Message Queue
- ✅ n8n Automation
- ✅ Prometheus Monitoring
- ✅ Grafana Dashboards
- ✅ Nginx Load Balancer

### Data Sources
- ✅ Football-Data.org
- ✅ Understat
- ✅ WhoScored
- ✅ FlashScore
- ✅ 25+ Global Leagues
- ✅ Live Match Updates

---

## 🔧 Configuration

### API Keys Required
1. **Football-Data.org**
   - Sign up: https://www.football-data.org/client/register
   - Get free API key

2. **Stripe** (Optional - for payments)
   - Sign up: https://stripe.com
   - Get test/live keys

3. **SendGrid** (Optional - for emails)
   - Sign up: https://sendgrid.com
   - Get API key

### Update .env.local
```env
# APIs
FOOTBALL_DATA_API_KEY=your_key_here
UNDERSTAT_API_KEY=your_key_here
WHOSCORED_API_KEY=your_key_here
FLASHSCORE_API_KEY=your_key_here

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/hermes_prod

# Redis
REDIS_CLUSTER_NODES=redis-1:6379,redis-2:6379,redis-3:6379

# Authentication
JWT_SECRET=your_super_secret_key

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## 🎯 Quick Start Commands

```bash
# Clone and enter
git clone https://github.com/mamadesko9999-jpg/Mamad13.git
cd Mamad13

# Install all dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start Docker services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start development server
npm run dev

# Or start in production
npm run build
npm run start

# View logs
npm run logs

# Stop services
docker-compose down
```

---

## 📊 Available Endpoints

### Matches (48 Hours)
```
GET  /api/v1/matches/48h
GET  /api/v1/matches/48h/today
GET  /api/v1/matches/48h/tomorrow
GET  /api/v1/matches/48h/live
GET  /api/v1/matches/48h/status/:status
GET  /api/v1/matches/48h/league/:league
GET  /api/v1/matches/48h/stats
```

### Predictions
```
GET  /api/v1/predictions
GET  /api/v1/predictions/:id
POST /api/v1/predictions
```

### User Management
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
```

### Admin
```
GET  /api/v1/admin/stats
GET  /api/v1/admin/logs
GET  /api/v1/admin/health
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Reset database
npm run db:reset
npm run db:seed
```

### Docker Issues
```bash
# Restart all services
docker-compose down
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker logs hermes-backend
docker logs hermes-postgres-primary
```

### Out of Memory
```bash
# Increase Docker memory
# Docker Desktop > Preferences > Resources > Memory: 8GB+
```

---

## 📚 Documentation

- **Full Documentation**: [README.md](./README.md)
- **API Reference**: [API.md](./docs/API.md)
- **Architecture**: [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Deployment**: [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- **Development**: [DEVELOPER.md](./docs/DEVELOPER.md)

---

## 🤝 Support

- **GitHub Issues**: https://github.com/mamadesko9999-jpg/Mamad13/issues
- **GitHub Discussions**: https://github.com/mamadesko9999-jpg/Mamad13/discussions
- **Email**: support@hermes-platform.com
- **Documentation**: https://docs.hermes-platform.com

---

## 📱 Mobile Apps

Coming Soon:
- iOS App (App Store)
- Android App (Google Play)
- Desktop App (Electron)

---

## 🎉 Ready to Use!

```
✅ Clone the repo
✅ Install dependencies
✅ Setup environment
✅ Start Docker
✅ Run migrations
✅ Start server
✅ Open http://localhost:3000

DONE! 🚀
```

---

**HERMES Football Intelligence Platform v1.0**
- 🌍 Global Scale (8 Billion Users)
- 🤖 12-Agent Pipeline
- ⚡ Real-time Updates
- 📊 Advanced Analytics
- 🔒 Enterprise Security

**Ready to download and run!** 🎯
