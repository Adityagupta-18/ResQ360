# ResQ360

> A web-based emergency coordination platform that allows citizens to anonymously report incidents and coordinates relevant verified organizations and independent volunteers through a shared incident workflow.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white" alt="Python 3.11">
  <img src="https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white" alt="Django">
  <img src="https://img.shields.io/badge/DRF-REST%20API-A30000?logo=django&logoColor=white" alt="Django REST Framework">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JavaScript-Fetch%20API-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML5-Frontend-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-Styling-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet&logoColor=white" alt="Leaflet">
  <img src="https://img.shields.io/badge/OpenStreetMap-Maps-7EBC6F?logo=openstreetmap&logoColor=white" alt="OpenStreetMap">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>


ResQ360 is a Django and Django REST Framework based emergency coordination platform designed around a simple idea: when an emergency is reported, the response may involve multiple organizations and community responders who need a shared way to receive relevant information, coordinate their response, and keep the citizen informed.

The platform supports anonymous citizen incident reporting, automatic emergency ID generation, responder dispatch, verified organization participation, volunteer notifications, incident status tracking, interactive maps, and location-based nearby help.

ResQ360 is built as a standalone educational/prototype platform and is **not a replacement for official emergency services such as India's 112 emergency response system**.


## Live Demo

**Live Application :** https://resq360-rane.onrender.com/

**Project Demo Video :** [Watch the ResQ360 Demo on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7507127033123106816/)


The deployed application demonstrates the implemented citizen, organization, and volunteer workflows, including incident reporting, emergency tracking, responder coordination, notifications, and map-based location features.



## Table of Contents

|                                                                               |                                                                   |
| :---------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| **01.** [Overview](#overview)                                                 | **10.** [Maps and Location Services](#maps-and-location-services) |
| **02.** [Key Features](#key-features)                                         | **11.** [API Architecture](#api-architecture)                     |
| **03.** [Application Flow](#application-flow)                                 | **12.** [Database Design](#database-design)                       |
| **04.** [Technology Stack](#technology-stack)                                 | **13.** [Installation and Setup](#installation-and-setup)         |
| **05.** [Project Structure](#project-structure)                               | **14.** [Deployment](#deployment)                                 |
| **06.** [Authentication and Authorization](#authentication-and-authorization) | **15.** [Project Status](#project-status)                         |
| **07.** [Incident Management](#incident-management)                           | **16.** [Future Improvements](#future-improvements)               |
| **08.** [Volunteer Coordination](#volunteer-coordination)                     | **17.** [Disclaimer](#disclaimer)                                 |
| **09.** [Notifications](#notifications)                                       | **18.** [Author](#author)                                         |


---

## Overview

Traditional emergency reporting often focuses on connecting a person with an emergency service. ResQ360 explores the coordination layer around an incident by allowing multiple verified organizations and independent volunteers to participate in the response workflow.

A citizen can report an emergency without creating an account. The platform creates a unique Emergency ID and determines which responder categories are relevant to the reported incident. Verified organizations matching those categories can receive the incident, while eligible active volunteers can also be notified.

Organizations can view assigned incidents and update their response through a controlled lifecycle:

```text
REPORTED  →  ACCEPTED  →  ENROUTE  →  IN_PROGRESS  →  RESOLVED
```

The citizen can use the Emergency ID to track the incident and see its current status.

ResQ360 also provides map-based responder workflows and a separate Nearby Help feature that allows citizens to find nearby medical, police, and fire-related locations using OpenStreetMap-based services.

---

## Key Features

### Citizen

* Anonymous emergency reporting without requiring an account.
* Incident type selection for:

  * Accident
  * Medical Emergency
  * Fire
  * Crime/Security
  * Missing Person
  * Blood Bank
* Location selection using an interactive Leaflet map.
* Browser-based current location detection.
* Draggable map marker for adjusting the reported location.
* Emergency details and quick-question based reporting.
* Automatic generation of a unique Emergency ID.
* Emergency tracking using the Emergency ID.
* Live incident status display based on the backend lifecycle.
* Nearby Help for:

  * Medical / Hospital
  * Police
  * Fire
* Route visualization to selected nearby help locations.

### Organizations

* Organization registration with verification document submission.
* Organization types:

  * Medical
  * Fire / Rescue
  * Police / Security
  * NGO
* Admin-based organization verification.
* Verification states for pending, verified, and rejected organizations.
* JWT-based organization login.
* Organization profile management.
* Dashboard showing assigned incidents.
* Incident detail view with responder information.
* Ability to accept an assigned incident.
* Controlled response lifecycle:

  * Accept
  * Enroute
  * In Progress
  * Resolved
* Interactive incident location and route map.
* Organization-specific incident ownership and authorization checks.
* Incident notifications.

### Volunteers

* Independent volunteer registration without organization membership.
* JWT-based volunteer authentication.
* Volunteer dashboard.
* Assigned emergency visibility.
* Emergency notifications.
* Emergency detail and status tracking.
* Interactive incident map and route.
* Current-location support for route visualization.
* Read-only responder workflow.
* Volunteers do not accept or control incident lifecycle states.

### Admin

* Django Admin interface for platform management.
* Organization verification and rejection.
* Management of users, organizations, incidents, assignments, volunteers, and notifications.
* Access to submitted organization verification documents.

### Platform

* Django REST Framework API architecture.
* PostgreSQL database.
* JWT authentication using SimpleJWT.
* Role-based permissions for organizations and volunteers.
* Verified-organization authorization for responder actions.
* Ownership checks for incident operations.
* Anonymous public incident tracking.
* Automatic incident dispatch based on incident type.
* Organization and volunteer notification system.
* Transaction-safe organization acceptance.
* Duplicate assignment protection.
* Leaflet and OpenStreetMap map integration.
* OSRM route calculation.
* OpenStreetMap/Nominatim-based Nearby Help search.
* Frontend communication through the Fetch API.
* Centralized frontend API request handling with access-token refresh support.

---

## Application Flow

The main ResQ360 workflow can be summarized as:

```text
                    +------------------+
                    |     CITIZEN      |
                    +--------+---------+
                             |
                             | Anonymous Report
                             v
                    +------------------+
                    |     INCIDENT     |
                    |   Created in DB  |
                    +--------+---------+
                             |
                             | Generate Emergency ID
                             v
                    +------------------+
                    |     DISPATCH     |
                    | Match Responders |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
              v                             v
     +------------------+          +------------------+
     | VERIFIED         |          | ACTIVE           |
     | ORGANIZATIONS    |          | VOLUNTEERS       |
     +--------+---------+          +--------+---------+
              |                             |
              | Notifications               | Notifications
              +--------------+--------------+
                             |
                             v
                    +------------------+
                    | RESPONSE FLOW    |
                    |                  |
                    | REPORTED         |
                    | ACCEPTED         |
                    | ENROUTE          |
                    | IN_PROGRESS      |
                    | RESOLVED         |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    | CITIZEN TRACKING |
                    | Emergency ID     |
                    +------------------+
```

The citizen does not need an account to create or track an incident. Organizations and volunteers use authenticated accounts to access responder functionality.

The backend remains the source of truth for incident status, responder assignments, permissions, and notifications.

---
## System Architecture

ResQ360 follows a layered web application architecture built around Django and Django REST Framework. The frontend communicates with the backend through REST APIs, while Django handles authentication, authorization, incident management, responder dispatch, notifications, and database operations.

The architecture separates the user-facing interface from the application logic and persistent data layer.

```text
                         RESQ360 PLATFORM
                               |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
   +----------+         +-------------+        +-------------+
   | CITIZEN  |         | ORGANIZATION|        | VOLUNTEER   |
   | Frontend |         |  Frontend  |        |  Frontend   |
   +-----+----+         +------+------+        +------+------+
         |                     |                      |
         |                     |                      |
         +---------------------+----------------------+
                               |
                               | HTTP / REST API
                               v
                  +---------------------------+
                  |      Django Backend       |
                  |                           |
                  |  Django REST Framework    |
                  |  Authentication           |
                  |  Permissions              |
                  |  Business Logic           |
                  +-------------+-------------+
                                |
          +---------------------+----------------------+
          |                     |                      |
          v                     v                      v
   +-------------+      +-------------+       +---------------+
   |    Users    |      |  Incidents  |       | Organizations |
   | Auth / JWT  |      | Dispatch    |       | Verification  |
   | Roles       |      | Tracking    |       | Assignments   |
   +-------------+      +-------------+       +---------------+
          |                     |                      |
          +---------------------+----------------------+
                                |
                                v
                     +----------------------+
                     |      PostgreSQL       |
                     |      Database         |
                     +----------------------+

             External Location Services
                         |
          +--------------+---------------+
          |              |               |
          v              v               v
      OpenStreetMap   Nominatim         OSRM
       Map Tiles    Nearby Search     Route Service
```

### Architectural Layers

#### Frontend Layer

The frontend is implemented using HTML, CSS, and JavaScript. Different interfaces are provided for citizens, organizations, and volunteers.

JavaScript communicates with the REST API using the browser Fetch API. A shared API helper handles authentication headers and access-token refresh behavior.

The frontend also integrates Leaflet for interactive maps and uses OpenStreetMap-based services for location and routing functionality.

#### API Layer

Django REST Framework provides the API layer between the frontend and application logic.

The API is responsible for:

* User registration and authentication.
* JWT token generation and refresh.
* Organization registration and verification-related data.
* Anonymous incident creation and tracking.
* Incident assignment and responder actions.
* Volunteer incident visibility.
* Notifications.
* Role and ownership validation.

#### Application Layer

Django contains the core business rules of ResQ360.

This layer determines:

* Which organization categories are relevant to an incident.
* Which verified organizations can receive an incident.
* Whether volunteers should be notified.
* Who is authorized to perform responder actions.
* Which incident lifecycle transitions are valid.
* Whether an organization can accept an incident.
* Which notifications belong to a particular responder.

Business rules are kept on the server so that frontend behavior does not determine authorization or incident state.

#### Data Layer

PostgreSQL stores the persistent application data, including users, organizations, incidents, responder assignments, volunteer assignments, and notifications.

Relationships between these entities allow the platform to maintain a single incident record while connecting the appropriate responders to it.

---

## Technology Stack

| Technology                | Category          | Role in ResQ360           | Why It Is Used                                                                                       |
| :------------------------ | :---------------- | :------------------------ | :--------------------------------------------------------------------------------------------------- |
| **Python 3.11**           | Backend           | Core programming language | Provides the foundation for the backend application and business logic.                              |
| **Django**                | Backend Framework | Application framework     | Handles the web application, models, views, authentication integration, and administration.          |
| **Django REST Framework** | API               | REST API layer            | Provides serializers, API views, validation, and RESTful endpoints for frontend communication.       |
| **PostgreSQL**            | Database          | Persistent data storage   | Stores users, organizations, incidents, assignments, volunteers, and notifications.                  |
| **SimpleJWT**             | Authentication    | JWT authentication        | Provides access and refresh tokens for authenticated organization and volunteer users.               |
| **HTML5**                 | Frontend          | Page structure            | Provides the structure for the citizen, organization, volunteer, login, and registration interfaces. |
| **CSS3**                  | Frontend          | Interface styling         | Handles application styling, layouts, responsive behavior, and visual presentation.                  |
| **JavaScript**            | Frontend          | Client-side functionality | Handles dynamic UI behavior, API communication, authentication state, and map interactions.          |
| **Fetch API**             | Frontend / API    | HTTP communication        | Connects the frontend interfaces with the Django REST APIs.                                          |
| **Leaflet**               | Maps              | Interactive mapping       | Displays incident locations, user locations, markers, and routes.                                    |
| **OpenStreetMap**         | Maps              | Map data                  | Provides the map tiles and geographic data used by the mapping features.                             |
| **Nominatim**             | Location Search   | Nearby place search       | Searches OpenStreetMap data for nearby medical, police, and fire-related locations.                  |
| **OSRM**                  | Routing           | Route calculation         | Calculates driving routes between the user's location and selected destinations.                     |
| **Git**                   | Version Control   | Source control            | Tracks project changes and development history.                                                      |
| **GitHub**                | Repository        | Source-code hosting       | Hosts the ResQ360 source code and project repository.                                                |
| **Postman**               | API Development   | API testing               | Used to develop, inspect, and test REST API endpoints during backend development.                    |
| **Django Admin**          | Administration    | Platform management       | Provides administrative management of users, organizations, incidents, and verification data.        |


---
### Backend

**Django** provides the main application framework, request handling, models, views, authentication integration, and administrative interface.

**Django REST Framework** is used to expose the application's functionality through RESTful endpoints. Serializers handle validation and API representations, while permission classes enforce access rules.

**PostgreSQL** is the relational database used to store the application's persistent data and relationships.

**SimpleJWT** provides access and refresh tokens for authenticated organization and volunteer users.

### Frontend

The current frontend uses server-rendered Django templates combined with HTML, CSS, and JavaScript.

JavaScript handles:

* REST API requests.
* Authentication token storage.
* Token refresh.
* Dynamic incident information.
* Dashboard data.
* Responder actions.
* Notifications.
* Map interactions.
* Location handling.

The frontend does not independently determine whether a responder is authorized to perform an operation. Authorization is enforced by the backend API.

---
## Maps and Location Services

ResQ360 uses **Leaflet** to provide interactive maps.

**OpenStreetMap** provides the map tiles used by the application.

For the citizen Nearby Help feature, **Nominatim** is used to search OpenStreetMap data for nearby medical, police, and fire-related locations.

**OSRM** is used to calculate driving routes between the user's location and a selected destination.

The location functionality is currently implemented using publicly available OpenStreetMap-based services and is intended for the project's current prototype implementation.
---

## Project Structure

ResQ360 is organized as a Django project with separate applications for authentication, organizations, incidents, notifications, and resource-related functionality. The frontend is implemented through Django templates and static JavaScript/CSS files.

```text
ResQ360/
│
├── apps/
│   ├── users/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── permissions.py
│   │   ├── urls.py
│   │   └── admin.py
│   │
│   ├── organizations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── permissions.py
│   │   ├── signals.py
│   │   ├── urls.py
│   │   └── admin.py
│   │
│   ├── incidents/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   │
│   ├── notifications/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   │
│   └── resources/
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── templates/
│   ├── base.html
│   ├── base_document.html
│   ├── base_app.html
│   ├── base_bare.html
│   ├── users/
│   ├── organizations/
│   └── incidents/
│
├── static/
│   ├── css/
│   └── js/
│       ├── api.js
│       ├── citizen/
│       ├── organization/
│       ├── volunteer/
│       └── ...
│
├── media/
│   └── verification_documents/
│
├── manage.py
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

### Django Applications

| Application       | Responsibility                                                                                                                                    |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **users**         | Custom user model, registration, authentication, JWT login, user roles, and user permissions.                                                     |
| **organizations** | Organization registration, organization profiles, verification status, verification documents, and organization-specific responder functionality. |
| **incidents**     | Incident creation, Emergency ID generation, incident tracking, responder assignments, dispatch rules, and incident lifecycle management.          |
| **notifications** | Creation, retrieval, ownership validation, and read-state management for organization and volunteer notifications.                                |
| **resources**     | Reserved application space for future resource-related functionality. It is not currently part of the active incident workflow.                   |

### Users Application

The `users` application manages the platform's custom user system.

The platform uses a single custom user model for authenticated responders, with `account_type` distinguishing between:

```text
                    User
                     |
             +-------+-------+
             |               |
            ORG             VOL
             |               |
      Organization       Volunteer
```

Organizations are linked to a separate `Organization` record, while volunteers use their user account directly and do not require a separate organization membership.

The application is responsible for:

* Custom user creation and management.
* Email-based authentication.
* Organization and volunteer registration.
* JWT authentication.
* Access and refresh tokens.
* Role-based permissions.
* Authenticated user information.

### Organizations Application

The `organizations` application handles organization-specific data and verification.

An organization belongs to exactly one user account through a one-to-one owner relationship.

Organizations contain information such as:

* Organization name.
* Organization type.
* Address.
* Verification document.
* Verification status.
* Owner.
* Creation and update timestamps.

Only verified organizations can participate in responder operations.

The application also contains the verification-document cleanup signal so that stored verification documents are removed when their associated organization is deleted.

### Incidents Application

The `incidents` application contains the core emergency coordination logic.

It manages:

* Incident creation.
* Incident types.
* Emergency ID generation.
* Location and incident details.
* Incident severity.
* People affected.
* Incident status.
* Organization assignments.
* Volunteer assignments.
* Organization response actions.
* Public incident tracking.
* Responder-specific incident APIs.
* Dispatch rules.

This application connects the citizen reporting process with the organization and volunteer response workflows.

### Notifications Application

The `notifications` application provides responder notifications.

A notification belongs to either:

* An organization, or
* A volunteer.

The database constraint ensures that a notification cannot have both recipients or no recipient.

Notifications contain the associated incident, recipient, message, read state, and creation timestamp.

Recipient ownership is validated by the backend before a notification can be marked as read.

### Templates

Django templates provide the current frontend interface.

The templates are separated according to their purpose and user experience, including:

* Authentication and registration.
* Citizen incident reporting and tracking.
* Organization dashboard and emergency views.
* Volunteer dashboard and emergency views.
* Organization verification status.

Shared base templates are used for common page structure and application layouts.

### Static JavaScript

Frontend JavaScript is organized around the different platform workflows.

The shared `api.js` helper provides the common API communication layer and handles:

* API requests.
* Authorization headers.
* Access-token usage.
* Refresh-token handling.
* Retrying requests after successful token refresh.

Role-specific JavaScript handles the behavior of citizen, organization, and volunteer interfaces.

This keeps API communication and role-specific frontend logic separated instead of duplicating authentication handling across individual pages.

---
## Application Workflow

ResQ360 is built around an incident-centric workflow. A citizen creates an incident, the backend determines the relevant responder categories, and the resulting incident is made available to eligible verified organizations and active volunteers.

The backend controls the incident state and responder permissions throughout the workflow.

### End-to-End Incident Flow

```text
+----------------+
|    CITIZEN     |
+-------+--------+
        |
        | Submit emergency report
        v
+------------------------+
|   INCIDENT CREATED     |
|                        |
| Type                   |
| Location               |
| Severity               |
| People Affected        |
| Emergency Details      |
+-----------+------------+
            |
            | Generate Emergency ID
            v
+------------------------+
|       DISPATCH         |
|                        |
| Determine required     |
| organization types     |
| and volunteer rules    |
+-----------+------------+
            |
      +-----+-----+
      |           |
      v           v
+-----------+ +-----------+
| VERIFIED  | |  ACTIVE   |
|   ORGS    | | VOLUNTEERS|
+-----+-----+ +-----+-----+
      |             |
      | Notify      | Notify
      |             |
      +------+------+
             |
             v
+------------------------+
|   RESPONDER WORKFLOW   |
|                        |
| REPORTED               |
|     ↓                  |
| ACCEPTED               |
|     ↓                  |
| ENROUTE                |
|     ↓                  |
| IN_PROGRESS            |
|     ↓                  |
| RESOLVED               |
+-----------+------------+
            |
            v
+------------------------+
|    CITIZEN TRACKING    |
|                        |
| Emergency ID           |
| Incident information   |
| Current status         |
+------------------------+
```

### 1. Citizen Reports an Incident

A citizen can start the emergency reporting process without creating an account.

The reporting flow collects the information required to create an incident, including:

* Incident type.
* Location.
* Address.
* Severity.
* Number of people affected.
* Incident-specific quick questions.

The location can be selected through the interactive map, where the browser's current location can be used and the marker can be adjusted before submission.

The frontend sends the incident information to the backend through the incident creation API.

### 2. Emergency ID Generation

When the backend creates the incident, it generates a unique Emergency ID in the format:

```text
EMG-XXXXXX
```

This identifier is returned to the citizen and is used as the public reference for tracking the incident.

The Emergency ID is generated by the backend rather than by the frontend, ensuring that incident identifiers remain controlled by the application.

### 3. Incident Dispatch

After an incident is created, ResQ360 determines which responder categories are relevant to the incident type.

The dispatch logic maps incident types to organization categories.

| Incident Type        | Organization Categories                        |
| :------------------- | :--------------------------------------------- |
| **Accident**         | Medical, Police / Security, NGO                |
| **Medical**          | Medical, NGO                                   |
| **Fire**             | Fire / Rescue, Medical, Police / Security, NGO |
| **Crime / Security** | Police / Security, NGO                         |
| **Missing Person**   | Police / Security, NGO                         |
| **Blood Bank**       | Medical, NGO                                   |

Only organizations that satisfy the required verification and responder eligibility conditions are assigned to the incident.

Volunteers are handled separately according to the incident's volunteer-notification rule.

### 4. Organization Assignment

Matching verified organizations receive an `IncidentOrganization` assignment.

An assignment records the relationship between an incident and an organization and initially starts in the:

```text
NOTIFIED
```

state.

The same organization cannot be assigned to the same incident more than once.

Once an authorized organization accepts an incident, its assignment changes to:

```text
ACCEPTED
```

and the incident itself moves into the accepted response state.

ResQ360 also prevents multiple organizations from taking ownership of the same incident through the acceptance operation.

### 5. Volunteer Assignment

Eligible active volunteers can receive an `IncidentVolunteer` assignment.

Volunteers are independent responders and are not associated with an organization through the incident workflow.

Unlike organizations, volunteers do not accept or control the incident lifecycle. Their interface provides visibility into relevant emergencies, notifications, incident details, maps, and response status.

For incidents where volunteer notification is disabled, volunteers are not assigned.

### 6. Incident Response Lifecycle

Once an organization accepts an incident, the response follows a controlled sequence:

```text
REPORTED  →  ACCEPTED  →  ENROUTE  →  IN_PROGRESS  →  RESOLVED
```

Each transition is performed through a protected backend operation.

The backend validates:

* The authenticated user.
* The user's account type.
* Organization verification status.
* Organization ownership of the assignment.
* Current incident state.
* Whether the requested transition is valid.

This prevents the frontend from directly manipulating the incident lifecycle.

### 7. Citizen Tracking

Citizens do not need an authenticated account to track an incident.

The Emergency ID can be used to retrieve the public tracking information associated with the incident.

The tracking interface displays relevant information such as:

* Emergency ID.
* Incident type.
* Severity.
* Number of people affected.
* Location/address.
* Creation time.
* Current incident status.

The tracking status is retrieved from the backend, so the citizen sees the actual incident state rather than a frontend-only progress indicator.


### 8. Incident Resolution

When the authorized organization completes the response, the incident transitions to:

```text
RESOLVED
```

The resolved state is reflected in the public tracking endpoint and responder interfaces.

The same backend incident record therefore acts as the source of truth throughout the complete workflow:

```text
REPORTED  →  ACCEPTED  →  ENROUTE  →  IN_PROGRESS  →  RESOLVED
```

---
## Authentication and Authorization

ResQ360 uses JWT-based authentication with role-based permissions to separate citizen, organization, and volunteer access.

### User Roles

| Role             |        Authentication       | Primary Access                              |
| :--------------- | :-------------------------: | :------------------------------------------ |
| **Citizen**      |         Not required        | Report and track incidents                  |
| **Organization** |           Required          | Manage assigned emergencies                 |
| **Volunteer**    |           Required          | View relevant emergencies and notifications |
| **Admin**        | Django Admin authentication | Platform and verification management        |

### JWT Authentication

Authenticated users receive an access token and refresh token through the authentication API.

```text
Login
  ↓
Access Token + Refresh Token
  ↓
Authenticated API Requests
  ↓
Access Token Expires
  ↓
Refresh Token
  ↓
New Access Token
```

The frontend stores the tokens locally and automatically attempts to refresh the access token when an authenticated API request receives an authorization failure.

### Role-Based Authorization

The backend uses dedicated permission classes to restrict API access based on the authenticated user's account type.

* `IsAuthenticated`
* `IsOrganization`
* `IsVolunteer`
* `IsVerifiedOrganization`

These permissions are enforced server-side rather than relying on frontend visibility alone.

### Organization Verification

Organizations cannot immediately access responder functionality after registration.

```text
Organization Registration
          ↓
     PENDING
          ↓
   Admin Verification
      ↙       ↘
   VERIFIED   REJECTED
      ↓
Responder    No responder
 access       access
```

A pending or rejected organization can access its permitted profile functionality but cannot perform protected responder operations.

Only a verified organization can access assigned incidents and perform response actions.

### Organization Ownership

Incident response actions are additionally protected by assignment ownership.

An organization can perform lifecycle actions only when:

1. The authenticated account belongs to an organization.
2. The organization is verified.
3. The organization owns the relevant incident assignment.
4. The requested lifecycle transition is valid.

This prevents another organization from taking control of an incident through a frontend request or manually constructed API request.

### Volunteer Authorization

Volunteers authenticate through the same JWT system but use volunteer-specific permissions and interfaces.

Volunteers can access incidents and notifications assigned to them, but they do not have organization responder controls such as accepting an incident or changing its lifecycle.

### Public Citizen Access

Citizen incident reporting and Emergency ID tracking are intentionally available without authentication.

The public tracking API exposes only the information required for incident tracking rather than authenticated responder or internal assignment data.

---
## Incident Management

Incidents are the central domain object in ResQ360. Each incident contains the information required to identify the emergency, determine relevant responders, track its progress, and expose a safe public tracking view.

### Incident Types

ResQ360 currently supports six incident categories:

* **Accident**
* **Medical**
* **Fire**
* **Crime / Security**
* **Missing Person**
* **Blood Bank**

Each incident stores its location, severity, number of people affected, incident-specific emergency details, creation time, and current lifecycle status.

### Emergency ID

Every incident receives a backend-generated Emergency ID such as:

```text
EMG-123456
```

The Emergency ID provides a human-readable reference that citizens can use to track their incident without creating an account.

### Incident Status

The incident lifecycle is:

```text
REPORTED → ACCEPTED → ENROUTE → IN_PROGRESS → RESOLVED
```

Status changes are controlled by protected backend endpoints and validated against the current state.

### Organization Dispatch

After an incident is created, ResQ360 determines which organization categories are relevant to that incident type.

| Incident Type        | Responding Organization Categories             |
| :------------------- | :--------------------------------------------- |
| **Accident**         | Medical, Police / Security, NGO                |
| **Medical**          | Medical, NGO                                   |
| **Fire**             | Fire / Rescue, Medical, Police / Security, NGO |
| **Crime / Security** | Police / Security, NGO                         |
| **Missing Person**   | Police / Security, NGO                         |
| **Blood Bank**       | Medical, NGO                                   |

Only eligible **verified organizations** are assigned to incidents according to these dispatch rules.

Volunteer notification is handled separately based on the incident type and volunteer eligibility.


### IncidentOrganization

Organization assignments are stored separately from the main incident record.

An assignment records:

* Incident
* Organization
* Assignment status
* Notification time
* Acceptance time

An `incident + organization` combination is unique, preventing duplicate assignments.

### Single Organization Acceptance

Multiple organizations may be notified about the same incident, but the backend prevents multiple organizations from accepting the same incident.

The acceptance operation uses database transaction handling and row-level locking to protect this operation from concurrent requests.

Once an organization accepts the incident, subsequent response actions are restricted to that organization's assignment.

### Lifecycle Protection

The backend validates every responder action before changing the incident state.

This ensures that a client cannot bypass the intended workflow simply by sending a different status value from the frontend.

### Anonymous Tracking

The public tracking endpoint accepts an Emergency ID and returns the information required by the citizen tracking interface.

Internal responder assignments, authorization details, and other protected information are not exposed through the public tracking flow.

---
## Volunteer Coordination

Volunteers are independent responders who can receive relevant emergency incidents without being part of an organization.

### Volunteer Registration

Volunteers register through the platform using their account details. Unlike organizations, volunteers do not require organization verification or a verification document.

After registration and login, volunteers can access their dedicated dashboard.

### Incident Assignment

Eligible active volunteers are notified based on the incident type.

| Incident Type    | Volunteer Notification |
| :--------------- | :--------------------: |
| Accident         |           Yes          |
| Medical          |           Yes          |
| Fire             |           Yes          |
| Crime / Security |           Yes          |
| Missing Person   |           No           |
| Blood Bank       |           Yes          |

Each volunteer can have only one assignment for a particular incident.

### Volunteer Interface

Volunteers can:

* View assigned emergencies.
* View emergency details.
* View incident status.
* Receive notifications.
* Mark notifications as read.
* View the incident location on a map.
* View a route from their current location to the incident.

Volunteers **cannot accept incidents or change the incident lifecycle**. Lifecycle control remains with the authorized organization responder.

## Notifications

Notifications provide responder-specific updates about incidents assigned to them.

A notification can belong to either:

* An organization, or
* A volunteer.

The database enforces that a notification has exactly one recipient.

### Notification Features

* Incident-specific notification messages.
* Emergency ID reference.
* Creation timestamp.
* Read/unread state.
* Recipient ownership validation.
* Individual notification read operation.

Users can only access notifications belonging to their own organization or volunteer account.

---
## Maps and Location Services

ResQ360 uses open mapping and routing services to provide location-based functionality without requiring paid map APIs.

### Interactive Maps

The frontend uses **Leaflet** to display interactive maps.

Map tiles are provided through **OpenStreetMap**.

Maps are used for:

* Citizen incident location selection.
* Incident location display.
* Organization responder maps.
* Volunteer emergency maps.
* Nearby help discovery.

### Citizen Location Selection

During incident reporting, the citizen can use the browser's current location to position the map.

The incident marker can also be dragged to adjust the exact location before submitting the report.

The selected latitude and longitude are then included in the incident submission.

### Nearby Help

The citizen interface provides nearby help categories for:

* Medical / Hospital
* Police
* Fire

Nearby places are searched using **Nominatim/OpenStreetMap** data. Returned locations are evaluated against the user's position to identify the closest available result.

### Routing

**OSRM** is used to calculate driving routes between the responder's current location and the incident or selected nearby destination.

The resulting route is displayed directly on the Leaflet map.

### Location Services Used

| Service                     | Purpose                   |
| :-------------------------- | :------------------------ |
| **Leaflet**                 | Interactive map rendering |
| **OpenStreetMap**           | Map data and tiles        |
| **Nominatim**               | Nearby place search       |
| **OSRM**                    | Driving route calculation |
| **Browser Geolocation API** | Current device location   |

---
## API Architecture

ResQ360 follows a REST API architecture using Django REST Framework. The frontend communicates with the backend through HTTP requests using the Fetch API.

The API is versioned under:

```text id="p8s3mb"
/api/v1/
```

### Authentication Endpoints

| Method | Endpoint                      | Purpose                                 |
| :----- | :---------------------------- | :-------------------------------------- |
| `POST` | `/api/v1/auth/register/`      | Register a volunteer account            |
| `POST` | `/api/v1/auth/login/`         | Authenticate a user                     |
| `POST` | `/api/v1/auth/token/refresh/` | Refresh an access token                 |
| `GET`  | `/api/v1/auth/me/`            | Retrieve authenticated user information |

### Organization Endpoints

| Method  | Endpoint                           | Purpose                         |
| :------ | :--------------------------------- | :------------------------------ |
| `POST`  | `/api/v1/organizations/register/`  | Register an organization        |
| `GET`   | `/api/v1/organizations/me/`        | Retrieve organization profile   |
| `PATCH` | `/api/v1/organizations/me/`        | Update permitted profile fields |
| `GET`   | `/api/v1/organizations/incidents/` | Retrieve assigned incidents     |

### Incident Endpoints

| Method | Endpoint                                                  | Purpose                        |
| :----- | :-------------------------------------------------------- | :----------------------------- |
| `POST` | `/api/v1/incidents/`                                      | Create an anonymous incident   |
| `GET`  | `/api/v1/incidents/track/<emergency_id>/`                 | Track an incident publicly     |
| `POST` | `/api/v1/incidents/organization-assignments/<id>/accept/` | Accept an assigned incident    |
| `POST` | Lifecycle action endpoints                                | Progress an accepted incident  |
| `GET`  | `/api/v1/incidents/volunteer/`                            | Retrieve volunteer assignments |

### Notification Endpoints

| Method | Endpoint                                        | Purpose                       |
| :----- | :---------------------------------------------- | :---------------------------- |
| `GET`  | `/api/v1/notifications/`                        | Retrieve user's notifications |
| `POST` | `/api/v1/notifications/<notification_id>/read/` | Mark a notification as read   |

### API Security

Protected endpoints use JWT authentication and backend permission checks.

Authorization is applied according to:

* Authentication state.
* Account type.
* Organization verification status.
* Assignment ownership.
* Incident lifecycle state.

The frontend therefore acts as the client interface, while authorization and business rules remain enforced by the Django backend.

---
## Database Design

ResQ360 uses PostgreSQL as its primary relational database.

The database is organized around the platform's main domain entities and their relationships.

### Core Models

| Model                    | Purpose                                                  |
| :----------------------- | :------------------------------------------------------- |
| **User**                 | Stores authenticated organization and volunteer accounts |
| **Organization**         | Stores organization details and verification information |
| **Incident**             | Stores emergency reports and their current lifecycle     |
| **IncidentOrganization** | Connects incidents with assigned organizations           |
| **IncidentVolunteer**    | Connects incidents with assigned volunteers              |
| **Notification**         | Stores responder-specific incident notifications         |

### Main Relationships

```text
User
 ├── Organization
 └── Volunteer Account

Incident
 ├── IncidentOrganization ── Organization
 ├── IncidentVolunteer ──── User
 └── Notification

Organization
 └── User (Owner)
```

The database uses UUIDs for the primary identifiers of the main application entities.

Important constraints are enforced at the database or application level, including:

* Unique organization ownership.
* Unique incident-organization assignments.
* Unique incident-volunteer assignments.
* Notification recipient integrity.
* Controlled incident lifecycle transitions.
* Organization verification requirements for responder operations.

---
## Installation and Setup

### Prerequisites

Make sure the following are installed:

* Python 3.11
* PostgreSQL
* Git

### Clone the Repository

```bash
git clone https://github.com/Adityagupta-18/ResQ360.git
cd ResQ360
```

### Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file in the project root and configure the required application settings.

Example:

```env
SECRET_KEY=your-secret-key
DEBUG=True

DB_NAME=your_database
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
```

Additional environment variables may be required depending on the deployment environment.

### Run Migrations

```bash
python manage.py migrate
```

### Create an Admin User

```bash
python manage.py createsuperuser
```

### Start the Development Server

```bash
python manage.py runserver
```

The application can then be accessed through the local Django development server.

## Deployment

ResQ360 is designed to be deployable using a Django-compatible hosting environment with PostgreSQL.

The production deployment setup uses:

* **Render** for application hosting.
* **Neon PostgreSQL** for the production database.

Environment variables should be configured through the hosting platform rather than committing secrets to the repository.

The `.env` file should remain excluded from version control.

### Production Considerations

Before production deployment, the following should be configured appropriately:

* `DEBUG=False`
* Production secret key
* PostgreSQL connection settings
* Allowed hosts
* Static file serving
* Media file handling
* Secure environment variables
* HTTPS

---
## Project Status

ResQ360 currently has a working backend and frontend integration covering the core emergency coordination workflow.

### Currently Implemented

* Anonymous citizen incident reporting.
* Emergency ID generation and public tracking.
* Incident-specific responder dispatch.
* Verified organization registration and verification workflow.
* Organization responder dashboard.
* Volunteer registration and dashboard.
* JWT authentication and role-based authorization.
* Organization ownership protection.
* Incident lifecycle management.
* Responder notifications.
* Leaflet and OpenStreetMap integration.
* Nearby medical, police, and fire help discovery.
* OSRM-based route visualization.
* PostgreSQL database support.
* Django Admin management.

## Future Improvements

The current implementation provides the foundation for further development. Potential improvements include:

* Real-time incident status updates.
* More advanced responder coordination.
* Improved notification delivery.
* Automated background processing for notifications and dispatch.
* Automated backend testing.
* Containerized deployment.
* More advanced frontend architecture.
* Production-scale infrastructure and monitoring.

These are planned improvements and are **not part of the current implementation**.

## Disclaimer

> ResQ360 is an educational/prototype emergency coordination platform and is not a replacement for official emergency services such as 112. In a real emergency, users should contact the appropriate official emergency service.

ResQ360 does not claim integration with or replacement of India's official emergency response system.

## Author

**Aditya Gupta**

Computer Science & Applied Mathematics student and software developer focused on Python, Django, REST APIs, and backend development.

### Connect

* GitHub: `AdityaGupta-18`
* LinkedIn: `adityagupta018`

---

## License

This project is intended for educational and portfolio purposes.
