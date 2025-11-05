# YuGiOh Locator CMS - Project Documentation

## Overview
The **YuGiOh Locator CMS** is a Content Management System designed to manage and display information about YuGiOh tournament locations and events. It allows administrators to manage three types of locations: Official Tournament Stores (OTS), Regional Qualifier Locations (RTS), and Sneak Peek Events (SPE).

## Technology Stack
- **Framework**: Laravel 5.4
- **PHP Version**: 8.3 (with compatibility patches)
- **Frontend**: Bootstrap CSS, jQuery, Google Maps API
- **Database**: MySQL

## User Flow & Application Logic

### 1. Authentication Flow

#### Login Process
1. User navigates to `http://localhost:8000/login`
2. User enters credentials (username and password)
3. Upon successful authentication:
   - User is redirected to the home route (`/`)
   - Home route automatically redirects to `/ots` (Official Tournament Store page)
4. All routes except login/register require authentication (`auth` middleware)

#### Logout
- User clicks "Logout" button in the header
- Session is cleared and user is redirected to login page

---

### 2. Main Application Structure

After login, users land on the **Official Tournament Store (OTS)** page by default. The application has three main sections accessible via the sidebar:

```
┌─────────────────────────────────────┐
│  Header: YuGiOh locator CMS        │  [Logout Button]
├──────┬──────────────────────────────┤
│      │                              │
│ Side │  Main Content Area           │
│ bar  │  (Current Section)           │
│      │                              │
│ • OTS│  - Data Table                │
│ • RTS│  - Add/Edit/Delete Buttons   │
│ • SPE│  - Search Functionality     │
│      │  - Google Maps Integration  │
│      │                              │
└──────┴──────────────────────────────┘
```

---

### 3. Official Tournament Store (OTS)

**Route**: `/ots`  
**Controller**: `OTSController`  
**Model**: `App\OTS` (maps to `store` table)

#### Features
- **View All Stores**: Displays a paginated table of all official tournament stores
- **Add Single Store**: 
  - Click "+" button to open modal
  - Fill in store details (location, address, city, state, zip, country, phone, email, etc.)
  - Optional: Add coordinates (lat/lng) or use Google Maps integration
  - Save to database
- **Edit Store**: 
  - Click edit button on a store row
  - Modal opens with pre-filled data
  - Update information and save
- **Delete Store**: 
  - Click delete button on a store row
  - Confirmation required
  - Store is removed from database
- **Bulk Import**: 
  - Upload Excel file (`.xlsx`)
  - Multiple stores imported at once
- **Search**: 
  - Real-time search filter
  - Filters table as you type

#### Data Fields
- Location name
- Address (address, address2, city, state, zip, country)
- Contact (phone, email)
- Coordinates (lat, lng)
- Features (duel_terminal, remote_duel, discord_invite)
- Status (active, featured, featured_url)

---

### 4. Regional Qualifier Location (RTS)

**Route**: `/rts`  
**Controller**: `RTSController`  
**Model**: `App\RTS` (maps to `regional` table)

#### Features
- **View All Regionals**: Displays paginated table of regional tournament locations
- **Add Single Regional**: 
  - Click "+" button
  - Fill in regional location details
  - Can add multiple events associated with this regional
- **Edit Regional**: 
  - Click edit button
  - Update location and event information
- **Delete Regional**: 
  - Remove regional and associated events
- **Bulk Import**: 
  - Upload Excel file with multiple regional locations
- **Events Management**: 
  - Each regional can have multiple events (dates/times)
  - Events stored in `RTSEvent` model
  - Can add/edit/delete events for each regional

#### Data Fields
- Location name, host
- Address (address, address2, city, state, zip, country)
- Contact (phone, email)
- Coordinates (lat, lng)
- **Events**: Array of event dates/times

---

### 5. Sneak Peek Event (SPE)

**Route**: `/spe`  
**Controller**: `SPEController`  
**Model**: `App\SPE` (maps to `sneak_peek_new` table)

#### Features
- **View All Sneak Peeks**: Displays table of sneak peek events
- **Add Single Sneak Peek**: 
  - Click "+" button
  - Fill in event location details
  - Can add multiple event dates/times
- **Edit Sneak Peek**: 
  - Update location and event information
- **Delete Sneak Peek**: 
  - Remove sneak peek and associated events
- **Bulk Import**: 
  - Upload Excel file with multiple sneak peek events
- **Events Management**: 
  - Each sneak peek can have multiple event dates
  - Events stored in `SPEEvent` model

#### Data Fields
- Location name, host
- Address (address, address2, city, state, zip, country)
- Contact (phone, email)
- Coordinates (lat, lng)
- **Events**: Array of event dates/times

---

### 6. Common Features Across All Sections

#### Google Maps Integration
- Uses Google Maps API for geocoding addresses
- Automatically retrieves coordinates (latitude/longitude) from addresses
- Can manually update coordinates if needed
- Maps displayed for location visualization

#### Search Functionality
- Real-time filtering as you type
- Searches across multiple fields (location, address, city, etc.)
- Client-side filtering for instant results

#### Bulk Operations
- **Import**: Upload Excel files (`.xlsx`) to add multiple entries at once
- **Delete All**: Remove all entries in a section (with confirmation)

#### Data Export
- Data can be retrieved via API endpoints (JSON format)
- Used for external applications or public-facing maps

---

## Database Structure

### Main Tables
1. **`store`** - Official Tournament Stores (OTS)
2. **`regional`** - Regional Qualifier Locations (RTS)
3. **`sneak_peek_new`** - Sneak Peek Events (SPE)
4. **`regional_events`** - Events associated with regionals
5. **`sneak_peek_events`** - Events associated with sneak peeks
6. **`users`** - User authentication

### Relationships
- `RTS` has many `RTSEvent` (one-to-many)
- `SPE` has many `SPEEvent` (one-to-many)

---

## API Endpoints

### Public/JSON Endpoints
- `GET /ots/getAllStores` - Returns all OTS stores as JSON
- `GET /rts/getAllRegionals` - Returns all regional locations as JSON
- `GET /spe/getAllSneakPeeks` - Returns all sneak peek events as JSON

### Admin Endpoints (Require Authentication)
All CRUD operations require authentication:
- `POST /ots/addNewOTS` - Create new store
- `POST /ots/{id}/editOneOTS` - Update store
- `GET /ots/{id}/delete` - Delete store
- `POST /ots/multiUploadOTS` - Bulk import stores
- Similar patterns for RTS and SPE

---

## File Structure

```
locatorcms/
├── app/
│   ├── Http/Controllers/
│   │   ├── OTSController.php      # Handles OTS operations
│   │   ├── RTSController.php      # Handles RTS operations
│   │   ├── SPEController.php      # Handles SPE operations
│   │   └── Auth/                  # Authentication controllers
│   ├── OTS.php                    # OTS Eloquent model
│   ├── RTS.php                    # RTS Eloquent model
│   ├── SPE.php                    # SPE Eloquent model
│   └── RTSEvent.php, SPEEvent.php # Event models
├── resources/views/
│   ├── layouts/
│   │   └── app.blade.php         # Main layout template
│   ├── pages/
│   │   ├── ots.blade.php          # OTS page view
│   │   ├── rts.blade.php          # RTS page view
│   │   └── spe.blade.php          # SPE page view
│   └── auth/
│       └── login.blade.php       # Login page
├── public_html/
│   ├── css/
│   │   ├── bootstrap.min.css     # Bootstrap styles
│   │   └── style.css             # Custom styles
│   └── js/
│       ├── jquery.min.js         # jQuery library
│       ├── bootstrap.min.js      # Bootstrap JS
│       ├── script.js             # Custom JavaScript
│       └── home.js               # Home page JS
└── routes/
    └── web.php                    # Route definitions
```

---

## Key Workflows

### Adding a New Store/Location
1. Navigate to desired section (OTS/RTS/SPE)
2. Click "+" button
3. Modal opens with form
4. Fill in required fields:
   - Location name (required)
   - Address information
   - Contact details
5. Optional: Use Google Maps to get coordinates automatically
6. Click "Save"
7. New entry appears in table

### Editing an Existing Entry
1. Click "Edit" button on table row
2. Modal opens with pre-filled data
3. Make changes
4. Click "Save"
5. Table updates with new information

### Bulk Import
1. Click "++" button (bulk upload)
2. Modal opens for file upload
3. Select Excel file (`.xlsx` format)
4. File is processed and entries are imported
5. Success/error message displayed

### Deleting Entries
1. Click "Delete" button on table row
2. Confirmation dialog appears
3. Confirm deletion
4. Entry is removed from database and table

---

## Security

- **Authentication Required**: All routes except login/register require authentication
- **CSRF Protection**: All forms include CSRF tokens
- **Session Management**: Laravel handles session security
- **Input Validation**: Form validation on all inputs

---

## Environment Configuration

Key configuration in `.env`:
- Database connection settings
- Google Maps API key (for geocoding)
- Application key (for encryption)

---

## Notes

- The application uses Laravel 5.4 with PHP 8.3 compatibility patches
- Static assets (CSS/JS) are served from `public_html/` directory
- Google Maps API integration requires a valid API key
- Excel import uses Maatwebsite Excel package
- All timestamps are disabled (`public $timestamps = false`)

---

## Future Enhancements (Potential)

- Admin role management (currently all authenticated users have full access)
- Export functionality (export data to Excel/CSV)
- Advanced filtering and sorting
- Map view showing all locations
- Public-facing API for mobile apps
- Image uploads for store/event photos

