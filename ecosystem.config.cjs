module.exports = {
  apps: [
    {
      name: "turboservis",
      cwd: "./backend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};

