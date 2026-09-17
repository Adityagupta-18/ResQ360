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

---

## Table of Contents

* [Overview](#overview)
* [Key Features](#key-features)

  * [Citizen](#citizen)
  * [Organizations](#organizations)
  * [Volunteers](#volunteers)
  * [Admin](#admin)
  * [Platform](#platform)
* [Application Flow](#application-flow)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Authentication and Authorization](#authentication-and-authorization)
* [Incident Management](#incident-management)
* [Organization Dispatch](#organization-dispatch)
* [Volunteer Coordination](#volunteer-coordination)
* [Notifications](#notifications)
* [Maps and Location Services](#maps-and-location-services)
* [API Architecture](#api-architecture)
* [Database Design](#database-design)
* [Installation and Setup](#installation-and-setup)
* [Environment Configuration](#environment-configuration)
* [Deployment](#deployment)
* [Project Status](#project-status)
* [Future Improvements](#future-improvements)
* [Disclaimer](#disclaimer)
* [Author](#author)

---

## Overview

Traditional emergency reporting often focuses on connecting a person with an emergency service. ResQ360 explores the coordination layer around an incident by allowing multiple verified organizations and independent volunteers to participate in the response workflow.

A citizen can report an emergency without creating an account. The platform creates a unique Emergency ID and determines which responder categories are relevant to the reported incident. Verified organizations matching those categories can receive the incident, while eligible active volunteers can also be notified.

Organizations can view assigned incidents and update their response through a controlled lifecycle:

```text
REPORTED
    |
    v
ACCEPTED
    |
    v
ENROUTE
    |
    v
IN_PROGRESS
    |
    v
RESOLVED
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
