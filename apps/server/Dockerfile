# -- Base stage
FROM public.ecr.aws/docker/library/node:lts-alpine as base

ARG ECR_ENVIRONMENT
ENV ECR_ENVIRONMENT=${ECR_ENVIRONMENT}

RUN echo "Running build command for $ECR_ENVIRONMENT"

# Create app directory
WORKDIR /app

# -- Build Dependency Stage
FROM base AS dependencies

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts

# -- Build Stage
FROM dependencies AS build

# Copy application source code and build
COPY . .
RUN if [ "$ECR_ENVIRONMENT" = "dev" ]; then \
			yarn build:server:dev; \
    elif [ "$ECR_ENVIRONMENT" = "staging" ]; then \
      yarn build:server:staging; \
    elif [ "$ECR_ENVIRONMENT" = "prod" ]; then \
      yarn build:server:prod; \
    else \
      echo "Unknown environment: $ECR_ENVIRONMENT" && \
      yarn build:server; \
    fi

# -- Release stage
FROM public.ecr.aws/docker/library/node:lts-alpine as release

# Set working directory
WORKDIR /app

# Copy only the production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy built application files from build stage
COPY --from=build /app/dist/apps/server ./

# Expose the specified port
EXPOSE 3000

# Start the application
CMD ["node", "main.js"]
