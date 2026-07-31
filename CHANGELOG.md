# Changelog
## [1.0.1] - 2026-07-31
### Fixed
- Sparkline now uses the theme's actual foreground color instead of
  hardcoded white, improving readability on light GNOME themes
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-07-23
### Added
- Initial stable release
- CPU, RAM, and temperature monitoring in the top panel
- CPU sparkline graph
- GPU usage and temperature monitoring (AMD/Radeon/Nouveau, NVIDIA via nvidia-smi)
- Network download/upload speed monitoring
- Process list showing top CPU/RAM consumers
- Stuck (D-state) and zombie process warnings
- Threshold-based color coding (normal/warning/critical)
- Configurable settings panel
