# Agent Documentation

## Project Overview

**Halijah's Manasik** is a comprehensive Islamic Hajj companion app with an admin CMS. The project consists of two main sections:

### 1. `./app/` - Expo Mobile App
- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Purpose**: Mobile application for Hajj pilgrimage guidance
- **Features**:
  - Audio duas (Islamic prayers) with Quranic references
  - Multi-language support (Arabic, English, Malay, etc.)
  - Dark/Light mode themes
  - Customizable text size scaling
  - Haptic feedback
  - Offline audio playback
  - Tab-based navigation (home, search, about, settings)
  - Haji-specific duas for Mina, Arafah, Mudzalifah, and Jamrah locations
- **Platforms**: iOS, Android, Web (via Expo)
- **Deployment**: EAS (Expo App Service)
- **Current Version**: 1.1.0

### 2. `./cms/` - Next.js Admin Dashboard
- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Purpose**: Content management system for managing app data
- **Responsibilities**:
  - Manage `assets/data/categories.json` - Category definitions
  - Manage `assets/data/duas.json` - Islamic prayers and their metadata
  - Drag-and-drop content organization (@hello-pangea/dnd)
  - RESTful API routes for data persistence
- **Deployment**: DigitalOcean App Platform

## Key Technologies

**Mobile App:**
- Expo Router for navigation
- React Navigation
- Expo Audio/Video (expo-av)
- Async Storage for local state
- Google Sign-In integration

**CMS:**
- Next.js (full-stack React)
- Tailwind CSS for styling
- Drag-and-drop library for content organization

## Data Structure

The app consumes two main JSON files managed by the CMS:
- **categories.json** - Categories of duas (e.g., "Duas at Mecca", "Duas at Medina")
- **duas.json** - Individual duas with audio references, translations, and metadata

## Available Agents

### Plan Agent
Researches and outlines multi-step plans for complex tasks.

**Usage Examples:**
- Planning multi-section feature implementations
- Designing data structure changes across both app and CMS
- Outlining deployment strategies for both platforms
- Structuring refactoring across the mobile and admin sections

## How to Use Agents

Agents are invoked to handle specific work items that require focused expertise. They receive task descriptions and execute them using their configured tools and models.

## When to Delegate

- Complex multi-step planning tasks across `./app/` and `./cms/`
- Tasks requiring coordination between mobile and web sections
- Data structure or content management workflow changes
- Tasks requiring specialized knowledge
- Work that benefits from autonomous execution

## Notes

- All agents work autonomously
- Agents can use their own set of tools
- Results should be reviewed for correctness
- Review `CHANGELOG.md` for recent changes and version history
- Use `EAS.md` for deployment procedures

