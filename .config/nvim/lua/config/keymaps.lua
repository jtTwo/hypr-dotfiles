-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

local map = vim.keymap.set

-- floating terminal
local lazyterm = function()
  LazyVim.terminal(nil, { cwd = LazyVim.root() })
end

map("n", "<C-ñ>", lazyterm, { desc = "Terminal (Root Dir)" })
map("t", "<C-ñ>", "<cmd>close<cr>", { desc = "Hide Terminal" })

-- buffers
map("n", "<S-w>", LazyVim.ui.bufremove, { desc = "Delete Buffer" })

-- windows
map("n", "<leader>+", "<C-W>v", { desc = "Split Window Right", remap = true })
