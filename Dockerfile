FROM node:lts

#Create and set working dir of the image
WORKDIR /usr/assembly-shop-api/

# Install app dependencies
COPY package*.json ./
RUN npm install

#Bundle app source 
COPY ./ ./

# RUN npm run build
CMD ["npm", "run", "dev"]