-- adding custom configs to the existing plungins

return {
  --dashboard configs
  {
    "/nvimdev/dashboard-nvim",
    opts = {
      theme = "doom",
      header = {},
      config = {
        week_header = {
          enable = true,
        },
      },
    },
  },
}
