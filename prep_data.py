#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Data Preparation & Bundling Script
Project: Digital Threats & Internet Freedom Dashboard
Specification: handoff_kp1.md
Branch: kp
"""

import sys
import os

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

# Run generation
import generate_dashboard_data

print("Data preparation completed successfully.")
