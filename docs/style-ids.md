# Style UID registry / 样式 UID

Every public style has a permanent six-character alphanumeric UID. The website, Markdown `preset:` field and Skill `--preset` / `--switch-to` accept this UID or the style name. Legacy P IDs and seven-part recipes stay compatible.

## Allocation (maintainers)

Format: `MM + A + S + B + T`. `MM` identifies mind maps. `ST` is a two-position uppercase base-36 allocation sequence; `A` and `B` are separately allocated unordered letters. For example, `MMK0V1` has sequence `01`, and `MMV0EA` has sequence `0A`. Allocate the next sequence and choose two unused-pattern letters when adding a style; store the complete UID explicitly. Do not calculate UIDs from display order or regenerate the letters at runtime. The pattern is for identification, not access control.

The single source of truth is `styleUIDs` in `src/library.cjs`. Append a new entry when extending the library. Never renumber, recycle a retired UID, or silently change its recipe. A different style receives a new UID; cosmetic refinements can retain identity. The next allocation after this release is `0H`. Keep UIDs as uppercase strings.

## Current styles

| UID | Name | Legacy alias |
| --- | --- | --- |
| MMK0V1 | 极简 | P61 |
| MMR0C2 | 自然 | P48 |
| MMT0H3 | 石板经典 | P40 |
| MMB0Q4 | 彩虹经典 | P39 |
| MMW0F5 | 暗夜粉彩 | P60 |
| MMD0N6 | 随手画画 | P65 |
| MMP0A7 | 脑洞涂鸦 | P67 |
| MMH0S8 | 浮生小趣 | P68 |
| MMC0Y9 | 商务蓝图 | P73 |
| MMV0EA | 知识提纲 | P74 |
| MMF0KB | 组织分层 | P75 |
| MMQ0DC | 便签共创 | P76 |
| MMN0WD | 概念分组 | P77 |
| MMA0RE | 项目分解 | P78 |
| MMS0BF | 语义索引 | P79 |
| MME0TG | 彩色研讨 | P80 |

Examples: `--preset MMK0V1` and `--preset 极简` select the same recipe. `--switch-to MMB0Q4` and `--switch-to 彩虹经典` select the same recipe. CLI receipts expose `uid` plus the legacy `preset` field for existing integrations. Saved documents retain the exact seven-part recipe.
