-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

local map = vim.keymap.set

-- floating terminal
local lazyterm = function()
  LazyVim.terminal(nil, { cwd = LazyVim.root() })
end
map("n", "<C-ñ>", lazyterm, { desc = "Terminal (Root Dir)" })
map("t", "<C-ñ>", "<cmd>close<cr>", { desc = "Hide Terminal" })
-- map("t", "<C-l>","<C-u>clear<cr><C-y>", { desc = "Clear the terminal"})
map("t", "<C-l>","<C-l>", { desc = "Clear the terminal"})

-- buffers
map("n", "<S-w>", LazyVim.ui.bufremove, { desc = "Delete Buffer" })

-- windows
map("n", "<leader>+", "<C-W>v", { desc = "Split Window Right", remap = true })

-- comment line
map("n", "<C-7>", "<cmd>normal gcc<cr>", { desc = "Comment/Uncomment" })
map("v", "<C-7>", "<cmd>normal gc<cr>", { desc = "Comment/Uncomment multiline" })

-- control erase
map("i", "<C-BS>", "<bs><cmd>normal db<cr>", { desc = "Delete word in insert mode" })
