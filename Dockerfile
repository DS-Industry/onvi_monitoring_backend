#____________________NEW_____________________
#
# 🧑‍💻 Development
#
FROM node:20-alpine as development
# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat
# Create app folder
WORKDIR /usr/src/app

# Set to dev environment
ENV NODE_ENV dev

# Copy source code into app folder
COPY --chown=node:node package*.json ./
COPY --chown=node:node ./prisma prisma

# Install dependencies
RUN npm ci

COPY --chown=node:node . .

# Set Docker as a non-root user
USER node

#
# 🏡 Production Build
#
FROM node:20-alpine as build

WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

# Copy source code into app folder
COPY --chown=node:node package*.json ./
COPY --chown=node:node ./prisma prisma

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Generate the production build. The build script runs "nest build" to compile the application.
RUN npm run build

# Install only the production dependencies and clean cache to optimize image size.
RUN npm ci --only=production && npm cache clean --force

# Set Docker as a non-root user
USER node

#
# 🚀 Production Server
#
FROM node:18-alpine as production

WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Set Docker as non-root user
USER node

CMD ["node", "dist/main.js"]
