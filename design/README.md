# Osh CRM — MVP design

Open `preview.html` to review five screens. Navigation and company links switch between concepts; this is not a working CRM.

## Figma
Native file: https://www.figma.com/design/aUmnuKbSqWgmVqVRiwgl8O
Team: Alex Will's team.
The Figma Starter MCP limit stopped writes. The native file contains the completed catalogue, partially completed company screen, shared sidebar and business-row components, and color variables. Pipeline and mobile wrappers there remain empty.

The five SVG files contain the completed visual concepts. Drag them into Figma manually or use File > Place image. They contain vector shapes and SVG text, but do not preserve native Figma auto-layout, component links, or prototype interactions. Font substitution can occur if Inter is unavailable. The supplied preview uses Inter with Arial fallback.

## Visual direction
Forest green #18382D, action green #176B4B, warm canvas #F7F8F4, surface #FFFFFF, soft green #E5EFE7, muted text #68766E, border #DFE5DD, amber #966021.
Desktop: 1440 × 1024. Mobile: 390 × 844. Touch controls generally 44–48px high.

## Interaction intent
Directory → company → add to pipeline is the core flow. Filters combine; rating and contact shortcuts are visible on rows. Full filter drawer should include category tree, status, wishlist, favourites, priority, tags, assignee, rating/review counts, contact availability, and deal stage. These secondary states are not drawn in this first concept set.
Relationship edits never overwrite source data. Team notes and author-private notes must be clearly distinguished; owner access to private notes is an unresolved product decision.
Pipeline columns scroll horizontally and have an alternative stage selector for touch/keyboard use. Sample sums: KGS 450,000 and USD 2,000, intentionally not combined. Visible subset of configurable stages shown.
Main screens are English; EN/RU controls indicate planned localization, not a completed Russian screen set.

## Deferred design scope
Map/cards desktop variants, filter drawer, tasks, settings, dashboard, login, empty/loading/error states, deal editor, export progress, note privacy selector and 360px adaptation need a follow-up design pass. These five screens are core-flow concepts, not the complete ToR UI specification.

All company names, counts, ratings, people and deal values are illustrative, not verified 2GIS records.
