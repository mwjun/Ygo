# Yu-Gi-Oh! Newsletter Signup Project - Overview

## 📋 Project Summary

This is a PHP-based newsletter signup system for three Yu-Gi-Oh! products: **Duel Links**, **Master Duel**, and **Trading Card Game (TCG)**. The system implements age verification (16+ required) and embeds third-party signup forms via iframes.

---

## 📁 Directory Structure

```
newsletter/
├── index.html                    # Main landing page (navigation hub)
├── error.html                    # Error page template
├── includes/
│   └── style.css                 # Shared stylesheet (legacy, minimal)
│
├── dl_signup/                    # Duel Links newsletter
│   ├── agegate.php              # Age verification form
│   ├── index.php                # Main signup page (after age verification)
│   ├── redirect.php             # Denied page (under 16)
│   └── img/                      # Game-specific images
│       ├── konami_logo.png
│       ├── Duel-Links-225x120.png
│       └── cr-digital.png
│
├── md_signup/                    # Master Duel newsletter
│   ├── agegate.php
│   ├── index.php
│   ├── redirect.php
│   └── img/
│       ├── konami_logo.png
│       ├── MD_logo_225x110.png
│       └── cr-digital.png
│
└── tcg_signup/                   # Trading Card Game newsletter
    ├── agegate.php
    ├── index.php
    ├── redirect.php
    └── img/
        ├── konami_logo.png
        ├── TCG_logo_225x100.png
        └── cr-tcg.png
```

---

## 🔄 User Flow & Application Logic

### Flow Diagram

```
User visits newsletter/
    ↓
[index.html] → Choose newsletter type
    ↓
[agegate.php] → Age verification form
    ↓
    ├─→ Age < 16 → [redirect.php] (Denied)
    └─→ Age ≥ 16 → Cookie set → [index.php]
                       ↓
                  [Signup Form iframe]
```

### Detailed Flow

1. **Entry Point** (`newsletter/index.html`)
   - Landing page with three newsletter options
   - User clicks on desired newsletter

2. **Age Verification** (`{newsletter}/agegate.php`)
   - **Purpose**: Verify user is 16+ years old
   - **Process**:
     - User enters date of birth (month, day, year)
     - Form validates and calculates age
     - Sets cookie: `legal = 'yes'` (if 16+) or `legal = 'no'` (if under 16)
     - Cookie expires in 2 hours (7200 seconds)
   - **Redirect Logic**:
     - If cookie already exists and is `'yes'` → redirects to `index.php`
     - If cookie is `'no'` → redirects to `redirect.php`

3. **Main Signup Page** (`{newsletter}/index.php`)
   - **Access Control**: Checks for `legal` cookie
     - If missing or not `'yes'` → redirects back to `agegate.php`
   - **Content**:
     - Displays Konami logo
     - Displays game-specific logo
     - Embeds third-party signup form via iframe
     - Shows legal text (Privacy Policy, Terms of Use)
     - Displays content rating image

4. **Denied Page** (`{newsletter}/redirect.php`)
   - Shows error message when user is under 16
   - Simple HTML page with denial message

---

## 🧩 Components Breakdown

### 1. Age Gate System (`agegate.php`)

**Key Features:**
- **Session Security**: Uses hidden session ID field to prevent CSRF
- **Age Calculation**: 
  ```php
  $birthstamp = mktime(0, 0, 0, $month, $day, $year);
  $diff = time() - $birthstamp;
  $age_years = floor($diff / 31556926);
  ```
- **Cookie Management**:
  - Cookie name: `legal`
  - Values: `'yes'` or `'no'`
  - Path: `/` (site-wide)
  - Duration: 2 hours

**Validation:**
- Input sanitization: `ctype_digit()` checks for numeric values
- Session validation: Compares submitted session ID with server session

### 2. Signup Pages (`index.php`)

**Access Control Logic:**
```php
if(!isset($_COOKIE['legal']) || $_COOKIE['legal'] != 'yes') {
    header('location: /newsletter/{newsletter}/agegate.php');
    exit;
}
```

**Embedded Forms:**
- **Duel Links**: `https://cdn.forms-content-1.sg-form.com/22cdc575-1867-11ef-a74f-6e96bce0832b`
- **Master Duel**: `https://cdn.forms-content-1.sg-form.com/b0cde6b5-1866-11ef-b7eb-dea4d84223eb`
- **TCG**: `https://cdn.forms-content-1.sg-form.com/422b389d-1864-11ef-9523-4ecf2d6389b9`

### 3. Styling System

**Current Implementation:**
- **Inline CSS**: Each page has embedded `<style>` tags with modern styling
- **Legacy CSS**: `includes/style.css` exists but is minimal (used by other parts of site)
- **Design Features**:
  - Dark gradient background (#1a1a2e → #0f3460)
  - White card-based layout
  - Red gradient headers (#b00000 → #8a0000)
  - Responsive design with max-width containers

### 4. Image Assets

Each newsletter directory contains:
- `konami_logo.png` - Konami corporate logo
- Game-specific logo (varies by newsletter)
- Content rating image (`cr-digital.png` or `cr-tcg.png`)

---

## 🔐 Security Features

1. **Session Validation**: Prevents form manipulation via hidden session ID
2. **Input Sanitization**: Uses `ctype_digit()` and `preg_replace()` for validation
3. **Cookie-Based Access Control**: Age verification stored in HTTP-only cookie
4. **Redirect Protection**: Prevents direct access to signup pages without verification

---

## 📝 Form Submission Process

### Age Gate Form (`agegate.php`)

**Form Fields:**
- `month` (select: 1-12)
- `day` (select: 1-31)
- `year` (select: 1925-2024)
- `sesh` (hidden: session ID)

**Submission Logic:**
1. Validates session ID matches server session
2. Calculates age from birthdate
3. Sets cookie based on age
4. Redirects to appropriate page

### Signup Form (Third-party iframe)

- Managed by external service (sg-form.com)
- Submission handled by third-party service
- No direct form handling in this codebase

---

## 🎨 Styling Architecture

### Current State

**Before Enhancement:**
- Minimal HTML with inline styles
- No responsive design
- Basic table-based layout

**After Enhancement:**
- Modern CSS with flexbox/grid
- Responsive containers
- Card-based design
- Gradient backgrounds
- Professional styling with shadows and transitions

**Style Organization:**
- Inline styles in each PHP file (for isolation)
- Shared stylesheet link included (for future expansion)
- No external CSS framework dependencies

---

## 🔧 Technical Stack

- **Server**: PHP 8.3.8 (Development Server)
- **Language**: PHP 7.4+ compatible
- **Frontend**: HTML5, CSS3
- **Dependencies**: None (vanilla PHP/HTML/CSS)
- **Third-party**: SG Form iframe embeds

---

## 🚀 Running the Project

### Local Development

```bash
# Start PHP development server from project root
php -S localhost:8001

# Access points:
# Main page: http://localhost:8001/newsletter/
# Duel Links: http://localhost:8001/newsletter/dl_signup/
# Master Duel: http://localhost:8001/newsletter/md_signup/
# TCG: http://localhost:8001/newsletter/tcg_signup/
```

### Production Deployment

- Requires PHP-enabled web server (Apache/Nginx)
- Ensure session support is enabled
- Cookie domain must be configured for production domain
- Path references use absolute paths (`/newsletter/...`)

---

## 📊 Data Flow

```
User Input
    ↓
Age Gate Form (agegate.php)
    ↓
PHP Processing
    ├─→ Age Calculation
    ├─→ Cookie Setting
    └─→ Redirect Decision
    ↓
Cookie Storage (Browser)
    ↓
Signup Page (index.php)
    ├─→ Cookie Check
    ├─→ Access Granted/Denied
    └─→ Form Display
    ↓
Third-party Form (iframe)
    ↓
External Submission Service
```

---

## 🐛 Known Issues & Notes

1. **Session Management**: Session code is commented out (originally designed for server-side sessions)
2. **Cookie Path**: Cookies set to `/` (site-wide) - may need adjustment for production
3. **Error Handling**: Minimal error handling for edge cases
4. **Legacy Code**: Some commented-out session code suggests migration from session-based to cookie-based auth

---

## 🔄 Recent Changes

### Enhancements Made:
- ✅ Fixed PHP warnings (undefined variables)
- ✅ Added modern CSS styling to all pages
- ✅ Created navigation landing page (`index.html`)
- ✅ Improved form validation and error handling
- ✅ Enhanced user experience with responsive design

### Files Modified:
- All `index.php` files (styling + cookie check fix)
- All `agegate.php` files (styling + redirect logic fix)
- New: `index.html` (navigation page)

---

## 📍 Key Files Reference

| File | Purpose | Key Logic |
|------|---------|-----------|
| `index.html` | Landing page | Navigation to newsletters |
| `{newsletter}/agegate.php` | Age verification | Age calculation, cookie setting |
| `{newsletter}/index.php` | Signup form | Cookie check, iframe embed |
| `{newsletter}/redirect.php` | Denial page | Shows error for underage users |
| `includes/style.css` | Legacy styles | Minimal shared styles |

---

## 🎯 Purpose & Use Case

This system is designed for:
- **Age-restricted content** (16+ requirement)
- **Newsletter signup collection** for Yu-Gi-Oh! products
- **Compliance** with age verification requirements
- **User experience** with clear navigation and styling

---

## 📞 Form Endpoints

All forms are hosted externally via SG Form service:
- No backend processing required for form submissions
- All data collection handled by third-party service
- This project only handles age verification and presentation

---

## 🔍 Code Patterns

### Cookie Check Pattern:
```php
if(!isset($_COOKIE['legal']) || $_COOKIE['legal'] != 'yes') {
    header('location: /newsletter/{newsletter}/agegate.php');
    exit;
}
```

### Age Calculation Pattern:
```php
$birthstamp = mktime(0, 0, 0, $month, $day, $year);
$diff = time() - $birthstamp;
$age_years = floor($diff / 31556926);
```

### Redirect Pattern:
```php
setcookie('legal', 'yes', time()+7200, '/');
header('Location: index.php');
```

---

## 📚 Additional Notes

- **Session ID**: Currently uses `session_id()` but sessions are not started (commented out)
- **Cookie Expiry**: 2 hours (7200 seconds) - configurable
- **Minimum Age**: 16 years (hardcoded in agegate.php)
- **Path Structure**: Uses absolute paths starting with `/newsletter/`

---

*Last Updated: November 2025*
*Version: 3.0.1 (Duel Links/Master Duel), 3.0.1a (TCG)*

---

## 🎨 Visual Design & User Interface

### Overall Visual Theme

The application features a **modern, professional design** with a dark gradient background and white card-based layouts. The color scheme is primarily **red (#b00000)** for branding, with clean white containers and subtle shadows for depth.

### Home Page (`index.html`)

**Visual Appearance:**
- **Background**: Light gray (#f0f0f0) - simple, clean backdrop
- **Container**: White card (960px max-width) with subtle shadow, centered on page
- **Header**: Large red heading (#b00000) "Yu-Gi-Oh! Newsletter Signup" centered at top
- **Layout**: Three-column grid (responsive, stacks on mobile) with newsletter cards
- **Newsletter Cards**:
  - White background with 2px gray border
  - Hover effect: Card lifts up (translateY) with enhanced shadow
  - Border changes to red on hover
  - Each card contains:
    - Newsletter title (red heading)
    - Descriptive text
    - Red "Sign Up" button that darkens on hover
- **Typography**: 'trebuchet ms' font family, clean and readable

### Age Gate Page (`agegate.php`)

**Visual Appearance:**
- **Background**: Dark gradient (linear-gradient from #1a1a2e → #16213e → #0f3460) - creates depth
- **Container**: White card (600px max-width) with rounded corners (12px) and strong shadow
- **Header Section**:
  - Red gradient background (#b00000 → #8a0000)
  - Centered Konami logo (max 200px width)
  - Clickable link to konami.com
- **Logo Section**:
  - Light gray background (#f8f8f8)
  - Newsletter-specific game logo (max 300px width)
  - Centered display
- **Content Area**:
  - White background with padding (40px)
  - Age form in light gray box (#f9f9f9) with rounded corners
  - Form contains:
    - Bold instruction text: "Please enter your date of birth to enter this site."
    - Three dropdown selects (Month, Day, Year) in a horizontal row
    - Dropdowns have gray borders that turn red on hover/focus
    - Red gradient submit button ("Enter") with hover lift effect
- **Footer**:
  - Light gray background (#f8f8f8)
  - Content rating image (max 350px width)
  - Small gray version text (v 3.0.1)

### Signup Pages (`index.php`)

**Visual Appearance:**
- **Background**: Same dark gradient as age gate (creates visual consistency)
- **Container**: White card (900px max-width, wider than age gate) with rounded corners and shadow
- **Header Section**:
  - Red gradient background matching age gate
  - Konami logo (max 200px, no link on signup pages)
- **Logo Section**:
  - Light gray background
  - Game-specific logo displayed prominently
- **Content Area**:
  - White background with padding (40px)
  - **Form Container**:
    - Light gray background (#f9f9f9)
    - Rounded corners (8px)
    - Embedded iframe with border and shadow
    - Form iframe is 600px height, full width
  - **Legal Text Section**:
    - White background
    - Left border accent (4px solid red)
    - Red links for Privacy Policy and Terms of Use
    - Italicized disclaimer about US territories
    - Line height 1.8 for readability
- **Footer**:
  - Light gray background
  - Content rating image (max 400px width)
  - Version number in small gray text

### Error/Denied Page (`redirect.php`)

**Visual Appearance:**
- **Background**: Default browser white
- **Typography**: 'trebuchet ms' font, normal size (.80em), line height 2em
- **Layout**: Simple centered text
- **Content**:
  - Blank spacing (non-breaking spaces)
  - Centered message: "Your request has been denied due to a policy configured by the website administrator"
  - Second centered message: "We are unable to process your request at this time."
  - Minimal styling - intentionally simple

### Design Elements

**Colors:**
- **Primary Red**: #b00000 (Konami brand color)
- **Dark Red**: #8a0000 (hover states, gradients)
- **Background Gray**: #f0f0f0 (home page)
- **Dark Gradient**: #1a1a2e → #16213e → #0f3460 (age gate/signup pages)
- **Light Gray**: #f8f8f8 (logo sections, footers)
- **Form Gray**: #f9f9f9 (form containers)
- **Border Gray**: #ddd (form borders)

**Typography:**
- **Font Family**: 'trebuchet ms', Arial, sans-serif
- **Font Sizes**: 
  - Headers: 16px-24px
  - Body: 14px-16px
  - Small text: 12px (version numbers)
- **Line Height**: 1.8em for readability

**Effects & Interactions:**
- **Shadows**: Box shadows on containers (0 10px 40px rgba(0,0,0,0.3))
- **Hover Effects**: 
  - Buttons lift up (translateY)
  - Borders change color
  - Shadows intensify
- **Transitions**: Smooth 0.2s-0.3s transitions on interactive elements
- **Focus States**: Red border glow on form inputs

**Responsive Design:**
- Containers have max-widths (600px age gate, 900px signup)
- Forms wrap on smaller screens
- Grid layouts adapt to screen size
- Images scale proportionally

### Visual Hierarchy

1. **Header** (Red gradient) - Brand identity
2. **Logo Section** (Light gray) - Product identification
3. **Main Content** (White) - Primary user interaction
4. **Footer** (Light gray) - Legal/compliance information

The design creates a clear visual flow from top to bottom, guiding users through the age verification and signup process with consistent branding and professional presentation.

