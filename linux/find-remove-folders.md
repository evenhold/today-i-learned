---
title: "How to find and delete directories with identical names"
date: 2026-06-17
category: "Linux"
tags: ["cli","automation", "find", "clean"]
---

# Finding and Deleting Folders Simultaneously

When managing multiple project, microservices or giant "node_modules" structures, you often need to purge folders that share the exact same name across different directories.

## The recommended command

The most efficient way to achieve this in Linux is using the `find` utility combined with `rm`.

```bash
find . -type d -name "target_folder_name" -exec rm  -rf {} +
```

## Breakdown of the Syntax
*  **`.`**: Start the search from your current working directory.
*  **`-type d`**: Restrict the search strictly to directories (folders).
*  **`-name "target_folder_name"`**: Matches the exact folder name you want to target (case-sensitive).
*  **`-exce rm -rf {} +`**: The core optimization. The `+` terminator aggregates all found directory paths and executes a single `rm -rf` command for all of them at once, heavily reducing OS process overhead.


## Safe First (Dry Run)

Since `rm -rf` bypasses the trash bin and deletes data permanently, it is highly recommended to run a "dry run" first to preview what will be deleted:

```bash
find . -type d -name "target_folder_name"
```

review the printed list in your terminal before appending the `-exec` deletion block.
