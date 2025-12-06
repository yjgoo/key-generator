module.exports = {
  apps: [
    {
      name: 'key-generator',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 8811,
        NODE_ENV: 'production',
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
    },
  ],
};
