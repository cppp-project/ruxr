#!/usr/bin/env python3

# -*- mode: python -*-
# vi: set ft=python :

# pylint: disable=C0103

# Copyright (C) 2024 The C++ Plus Project.
# This file is part of the Rubisco Extension Repository.
#
# Rubisco Extension Repository is free software: you can redistribute it and/or
# modify it under the terms of the GNU General Public License as published
# by the Free Software Foundation, either version 3 of the License,
# or (at your option) any later version.
#
# Rubisco Extension Repository is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

"""Utility script to trim the license metadata JSON file."""

import json
import sys
from pathlib import Path
from typing import cast


def get_typecheck[T](obj: object, expected_type: type[T]) -> T:
    """Check the type of an object and return it if it matches.

    Returns:
        T: The object cast to the expected type.

    """
    if not isinstance(obj, expected_type):
        sys.exit(f"Error: Expected {expected_type}, got {type(obj)}.")
    return obj


if __name__ == "__main__":
    if len(sys.argv) != 4:  # noqa: PLR2004
        sys.exit("Usage: licenses-meta.py metafile htmlfile destfile")
    src_file = Path(sys.argv[1])
    license_html = Path(sys.argv[2])
    dest_file = Path(sys.argv[3])
    with (
        src_file.open(encoding="utf-8") as in_file,
        dest_file.open("w", encoding="utf-8") as out_file,
    ):
        data_ = json.load(in_file)
        if not isinstance(data_, dict):
            sys.exit(f"Error: {src_file} does not contain a JSON object.")
        data = cast("dict[str, object]", data_)
        out_data: dict[str, str | bool] = {}
        out_data["isFsfLibre"] = get_typecheck(
            data.get("isFsfLibre", False),
            bool,
        )
        out_data["name"] = get_typecheck(data["name"], str)
        out_data["isOsiApproved"] = get_typecheck(
            data.get("isOsiApproved", False),
            bool,
        )
        license_id = get_typecheck(data["licenseId"], str)
        out_data["licenseHtmlText"] = license_html.read_text(encoding="utf-8")
        json.dump(out_data, out_file, ensure_ascii=False, sort_keys=True)
