#!/bin/sh
# Copyright (c) 2021-2022 Koichi Nakashima
# shdotenv is released under the MIT license
# https://opensource.org/licenses/MIT
set -eu
IFS=$(printf '\n\t')&&IFS=" ${IFS#?}${IFS%?}"
version(){ echo 0.9.0;}
usage(){
printf '%s\n' "Usage: shdotenv [OPTION]... [--] [[COMMAND | export] [ARG]...]" \
"" \
"  If the COMMAND is specified, it will load .env files and run the command." \
"  If the COMMAND is omitted, it will output the result of interpreting .env" \
"  files. It can be safely loaded into the shell (For example, using eval)." \
"" \
"Options:" \
"  -d, --dialect DIALECT     Specify the .env dialect [default: posix]" \
"                                posix, ruby, node, python," \
"                                php, go, rust, docker" \
"  -f, --format FORMAT       Output in the specified format [default: sh]" \
"                                sh, fish" \
"  -e, --env ENV_PATH        Location of the .env file [default: .env]" \
"                              Multiple -e options are allowed" \
'                              If the ENV_PATH is "-", read from stdin' \
"  -i, --ignore-environment  Ignore the current environment variables" \
"      --overload            Overload predefined environment variables" \
'      --noexport            Do not append "export" prefix' \
"      --grep PATTERN        Output only names that match the regexp pattern" \
"      --name-only           Output only environment variable names" \
"  -q, --quiet               Suppress all output (useful for test .env files)" \
"  -v, --version             Show the version and exit" \
"  -h, --help                Show this message and exit" \
"" \
"  Deprecated: (to be removed in the next version)" \
"  -s, --shell SHELL         Use the -f (--format) option instead" \
"  -k, --keyonly             Use the --name-only option instead" \
"  -o, -n, -g                Use long options instead" \
"" \
"Usage: shdotenv export [-n | -p] [--] [NAME]..." \
"  Exports environment variables in posix-compliant .env format." \
"" \
"  -n  List only environment variable names" \
'  -p  Append "export" prefix to environment variable names' \
"" \
"  This will be output after the .env files is loaded. If you do not want" \
'  to load it, specify "-e /dev/null". This is similar to "export", "env"' \
'  and "printenv" commands, but quoting correctly and exports only portable' \
"  environment variable name that are valid as identifier for posix shell."
}
abort(){ echo "shdotenv:" "$@" >&2&&exit 1;}
requires(){
[ $# -gt 1 ]||abort "Error: $1 option requires an argument"
_shdotenv_pos=$((_shdotenv_pos+1))
}
parse_options(){
while [ $# -gt 0 ];do
case $1 in
-d|--dialect)requires "$@"&&shift&&_shdotenv_dialect="$1";;
-s|--shell)requires "$@"&&shift&&\
_shdotenv_format="$1"
[ "$_shdotenv_format" = "posix" ]&&_shdotenv_format="sh"
;;
-f|--format)requires "$@"&&shift&&_shdotenv_format="$1";;
-e|--env)requires "$@"&&shift
_shdotenv_envfiles="$_shdotenv_envfiles \"\${$_shdotenv_pos}\""
;;
-i|--ignore-environment)_shdotenv_ignore=1;;
-o|--overload)_shdotenv_overload=1;;
-n|--noexport)_shdotenv_allexport='';;
-g|--grep)requires "$@"&&shift&&_shdotenv_grep="$1";;
-k|--keyonly|--name-only)_shdotenv_nameonly=1;;
-q|--quiet)_shdotenv_quiet=1;;
-v|--version)version&&exit 0;;
-h|--help)usage&&exit 0;;
--)_shdotenv_pos=$((_shdotenv_pos+1))&&break;;
-*)abort "Unknown option: $1";;
*)break
esac
shift
_shdotenv_pos=$((_shdotenv_pos+1))
done
}
trim(){
eval "$1=\${2#\"\${2%%[!\$IFS]*}\"} && $1=\${$1%\"\${$1##*[!\$IFS]}\"}"
}
unexport(){
set -- "$@" "$*"
while [ $# -gt 1 ];do
unset "${1%%=*}"
shift
done
eval "$*"
}
init_vars(){
set --
set -- "$@" _shdotenv_dialect= _shdotenv_format= _shdotenv_grep=
set -- "$@" _shdotenv_envfiles= _shdotenv_overload= _shdotenv_allexport=1
set -- "$@" _shdotenv_nameonly= _shdotenv_quiet= _shdotenv_ignore=
set -- "$@" _shdotenv_pos=1 _shdotenv_line=
unexport "$@"
_shdotenv_format="${SHDOTENV_FORMAT:-}"
[ "$_shdotenv_format" ]||_shdotenv_format="${SHDOTENV_SHELL:-}"
_shdotenv_parser='#!/usr/bin/awk -f
function abort(msg) {
print msg > "/dev/stderr"
exit 1
}
function syntax_error(msg) {
sub("[\n]+$", "", CURRENT_LINE)
abort(sprintf("`%s'\'': %s", CURRENT_LINE, msg))
}
function trim(str) {
sub("(^[ \t]+)|([ \t]+$)", "", str)
return str
}
function chomp(str) {
sub("\n$", "", str)
return str
}
function dialect(name) {
return index("|" name "|", "|" DIALECT "|") > 0
}
function unescape(str, escape, keep_backslash,  escapes, idx) {
split(escape, escapes, "")
for (idx in escapes) {
escape = escapes[idx]
if (str == "\\" escape) return ESCAPE[escape]
}
return (keep_backslash ? str : substr(str, 2))
}
function unquote(str, quote) {
if (match(str, "^" quote ".*" quote "$")) {
gsub("^['\''\"]|['\''\"]$", "", str)
return str
}
syntax_error("unterminated quoted string")
}
function expand_env(key) {
return (key in environ) ? environ[key] : ""
}
function parse_key(key) {
if (dialect("ruby|node|python|php|go")) {
key = trim(key)
}
if (match(key, "(^[ \t]+|[ \t]+$)")) {
abort(sprintf("`%s'\'': no space allowed after the key", key))
}
if (!match(key, "^(export[ \t]+)?" IDENTIFIER "$")) {
abort(sprintf("`%s'\'': the key is not a valid identifier", key))
}
return key
}
function parse_key_only(str) {
if (!sub("^export[ \t]+", "", str)) {
syntax_error("not a variable definition")
}
sub("[ \t]#.*", "", str)
if (!match(str, "^(" IDENTIFIER "[ \t]*)+$")) {
abort(sprintf("`%s'\'': the key is not a valid identifier", str))
}
return str
}
function parse_raw_value(str) {
return str
}
function parse_unquoted_value(str) {
if (dialect("posix")) {
if (match(str, "[ \t]")) {
syntax_error("spaces are not allowed without quoting")
}
if (match(str, "[][{}()<>\"'\''`!$&~|;\\\\*?]")) {
syntax_error("using without quotes is not allowed: !$&()*;<>?[\\]`{|}~")
}
} else {
str = trim(str)
}
return expand_value(str, NO_QUOTES)
}
function parse_single_quoted_value(str) {
if (index(str, "'\''")) {
syntax_error("using single quote not allowed in the single quoted value")
}
return str
}
function parse_double_quoted_value(str) {
return expand_value(str, DOUBLE_QUOTES)
}
function expand_value(str, quote,  variable, new) {
ESCAPED_CHARACTER = "\\\\."
META_CHARACTER = "[$`\"\\\\]"
VARIABLE_EXPANSION = "\\$[{][^}]*}"
if (dialect("ruby|node|go|rust")) {
VARIABLE_EXPANSION = "\\$" IDENTIFIER "|" VARIABLE_EXPANSION
}
while(match(str, ESCAPED_CHARACTER "|" VARIABLE_EXPANSION "|" META_CHARACTER)) {
pos = RSTART
len = RLENGTH
variable = substr(str, pos, len)
if (quote == DOUBLE_QUOTES) {
if (match(variable, "^" META_CHARACTER "$")) {
syntax_error("the following metacharacters must be escaped: $`\"\\")
}
if (match(variable, "^" ESCAPED_CHARACTER "$")) {
if (dialect("posix")) variable = unescape(variable, "$`\"\\\n", KEEP)
if (dialect("ruby|go")) variable = unescape(variable, "nr", NO_KEEP)
if (dialect("node|rust")) variable = unescape(variable, "n", KEEP)
if (dialect("python")) variable = unescape(variable, "abfnrtv", KEEP)
if (dialect("php")) variable = unescape(variable, "fnrtv", KEEP)
}
}
if (match(variable, "^\\$" IDENTIFIER "$")) {
variable = expand_env(substr(variable, 2))
} else if (match(variable, "^\\$[{]" IDENTIFIER "}$")) {
variable = expand_env(substr(variable, 3, length(variable) - 3))
} else if (match(variable, "^" VARIABLE_EXPANSION "$")) {
if (!match(variable, "^\\$[{]" IDENTIFIER "}$")) {
syntax_error("the variable name is not a valid identifier")
}
}
new = new substr(str, 1, pos - 1) variable
str = substr(str, pos + len)
}
return new str
}
function remove_optional_comment(value, len,  rest) {
rest = substr(value, len + 1)
if (match(rest, "^#.*")) {
syntax_error("spaces are required before the end-of-line comment")
}
sub("^([ \t]+#.*|[ \t]*)$", "", rest)
return substr(value, 1, len) rest
}
function output(flag, key, value) {
if (FORMAT == "sh") output_sh(flag, key, value)
if (FORMAT == "fish") output_fish(flag, key, value)
}
function output_sh(flag, key, value) {
if (match(value, /'\''/)) {
gsub(/[$`"\\]/, "\\\\&", value)
value = "\"" value "\""
} else {
value = "'\''" value "'\''"
}
if (flag == ONLY_EXPORT) print "export " key
if (flag == DO_EXPORT) print "export " key "=" value
if (flag == NO_EXPORT) print key "=" value
}
function output_fish(flag, key, value) {
gsub(/[\\'\'']/, "\\\\&", value)
if (flag == ONLY_EXPORT) print "set --export " key " \"$" key "\";"
if (flag == DO_EXPORT) print "set --export " key " '\''" value "'\'';"
if (flag == NO_EXPORT) print "set " key " '\''" value "'\'';"
}
function parse(lines) {
SQ_VALUE = "'\''[^\\\\'\'']*'\''?"
DQ_VALUE = "\"(\\\\\"|[^\"])*[\"]?"
NQ_VALUE = "[^\n]+"
if (dialect("docker")) {
LINE = NQ_VALUE
} else {
LINE = SQ_VALUE "|" DQ_VALUE "|" NQ_VALUE
}
while (length(lines) > 0) {
if (sub("^[ \t\n]+", "", lines)) continue
if (sub("^#([^\n]+)?(\n|$)", "", lines)) continue
if (!match(lines, "^([^=\n]*=(" LINE ")?[^\n]*([\n]|$)|[^\n]*)")) {
abort(sprintf("`%s'\'': parse error", lines))
}
CURRENT_LINE = line = chomp(substr(lines, RSTART, RLENGTH))
lines = substr(lines, RSTART + RLENGTH)
equal_pos = index(line, "=")
if (equal_pos == 0) {
key = parse_key_only(line)
} else {
key = parse_key(substr(line, 1, equal_pos - 1))
}
if (NAMEONLY) {
if (!OVERLOAD && key in environ) continue
print key
environ[key] = ""
} else if (equal_pos == 0) {
output(ONLY_EXPORT, key)
} else {
export = (ALLEXPORT ? DO_EXPORT : NO_EXPORT)
if (sub("^export[ \t]+", "", key)) export = DO_EXPORT
value = substr(line, equal_pos + 1)
if (dialect("docker")) {
value = parse_raw_value(value)
} else if (match(value, "^"SQ_VALUE)) {
value = remove_optional_comment(value, RLENGTH)
value = parse_single_quoted_value(unquote(value, "'\''"))
} else if (match(value, "^"DQ_VALUE)) {
value = remove_optional_comment(value, RLENGTH)
value = parse_double_quoted_value(unquote(value, "\""))
} else {
if (match(value, "[ \t]#")) {
value = remove_optional_comment(value, RSTART - 1)
}
value = parse_unquoted_value(trim(value))
}
if (!OVERLOAD && key in environ) continue
environ[key] = value
if (match(key, GREP)) output(export, key, value)
}
}
}
BEGIN {
IDENTIFIER = "[a-zA-Z_][a-zA-Z0-9_]*"
KEEP = 1; NO_KEEP = 0
ONLY_EXPORT = 0; DO_EXPORT = 1; NO_EXPORT = 2
NO_QUOTES = 0; SINGLE_QUOTES = 1; DOUBLE_QUOTES = 2
ESCAPE["$"] = "$"
ESCAPE["`"] = "`"
ESCAPE["\""] = "\""
ESCAPE["\\"] = "\\"
ESCAPE["\n"] = ""
ESCAPE["a"] = "\a"
ESCAPE["b"] = "\b"
ESCAPE["f"] = "\f"
ESCAPE["n"] = "\n"
ESCAPE["r"] = "\r"
ESCAPE["t"] = "\t"
ESCAPE["v"] = "\v"
if (!IGNORE) {
for (key in ENVIRON) {
environ[key] = ENVIRON[key]
}
}
if (FORMAT == "") FORMAT = "sh"
if (!match(FORMAT, "^(sh|fish)$")) {
abort("unsupported format: " FORMAT)
}
if (ARGC == 1) {
ARGV[1] = "/dev/stdin"
ARGC = 2
}
for (i = 1; i < ARGC; i++) {
getline < ARGV[i]
lines = $0 "\n"
if (DIALECT == "" && sub("^# dotenv ", "")) DIALECT = $0
if (DIALECT == "") DIALECT = "posix"
if (!dialect("posix|docker|ruby|node|python|php|go|rust")) {
abort("unsupported dotenv dialect: " DIALECT)
}
while (getline < ARGV[i] > 0) {
lines = lines $0 "\n"
}
if (!match(ARGV[i], "^(/dev/stdin|-)$")) close(ARGV[i])
parse(lines)
}
exit
}'
_shdotenv_exporter='#!/usr/bin/awk -f
function abort(msg) {
print msg > "/dev/stderr"
exit 1
}
function quotes(value) {
if (match(value, /'\''/)) {
gsub(/[$`"\\]/, "\\\\&", value)
return "\"" value "\""
}
return "'\''" value "'\''"
}
function sort(ary,  len, min, tmp, i, j) {
len = 0
for (i in ary) len++
for (i = 0; i < len - 1; i++) {
min = i
for (j = i + 1; j < len; j++) {
if (ary[min] > ary[j]) min = j
}
tmp = ary[min]
ary[min] = ary[i]
ary[i] = tmp
}
}
BEGIN {
ex = envkeys_length = 0
prefix = nameonly = ""
for (key in ENVIRON) {
if (!match(key, "^[a-zA-Z_][a-zA-Z0-9_]*$")) continue
if (match(key, /^(AWKPATH|AWKLIBPATH)$/)) continue
environ[key] = ENVIRON[key]
envkeys[envkeys_length++] = key
}
for (i = 1; i < ARGC; i++) {
if (ARGV[i] == "-") {
i++
break
}
if (match(ARGV[i], "=")) {
key = substr(ARGV[i], 1, RSTART - 1)
value = substr(ARGV[i], RSTART + 1)
environ[key] = value
envkeys[envkeys_length++] = key
}
}
for (; i < ARGC; i++) {
if (ARGV[i] == "-p") {
prefix = "export "
} else if (ARGV[i] == "-n") {
nameonly = 1
} else if (ARGV[i] == "--") {
i++
break
} else if (substr(ARGV[i], 1, 1) == "-") {
abort("shdotenv export: Unknown option: " ARGV[i])
} else {
break
}
}
if (i < ARGC) {
envkeys_length = 0
for (; i < ARGC; i++) {
envkeys[envkeys_length++] = ARGV[i]
}
} else {
sort(envkeys)
}
for (i = 0; i < envkeys_length; i++ ) {
if (envkeys[i] in environ) {
if (nameonly) {
printf prefix "%s\n", envkeys[i]
} else {
printf prefix "%s=%s\n", envkeys[i], quotes(environ[envkeys[i]])
}
} else {
ex = 1
}
}
exit ex
}'
}
read_config_file(){
[ -e "$1" ]||return 0
while IFS= read -r _shdotenv_line||[ "$_shdotenv_line" ];do
_shdotenv_line=${_shdotenv_line%%#*}
trim _shdotenv_line "$_shdotenv_line"
case $_shdotenv_line in
dialect:*)trim _shdotenv_dialect "${_shdotenv_line#*:}";;
*)abort "Unknown line in $1: $_shdotenv_line"
esac
done <"$1"
}
exec_parser(){
eval "set -- ${_shdotenv_envfiles:-.env}"
set -- "$_shdotenv_parser" "$@"
[ "$_shdotenv_dialect" ]&&set -- -v DIALECT="$_shdotenv_dialect" "$@"
[ "$_shdotenv_format" ]&&set -- -v FORMAT="$_shdotenv_format" "$@"
[ "$_shdotenv_overload" ]&&set -- -v OVERLOAD="$_shdotenv_overload" "$@"
[ "$_shdotenv_allexport" ]&&set -- -v ALLEXPORT="$_shdotenv_allexport" "$@"
[ "$_shdotenv_grep" ]&&set -- -v GREP="$_shdotenv_grep" "$@"
[ "$_shdotenv_nameonly" ]&&set -- -v NAMEONLY="$_shdotenv_nameonly" "$@"
[ "$_shdotenv_ignore" ]&&set -- -v IGNORE="$_shdotenv_ignore" "$@"
"${SHDOTENV_AWK:-awk}" "$@"
}
exec_exporter(){
set -- - "$@"
[ "${AWKPATH+x}" ]&&set -- "AWKPATH=$AWKPATH" "$@"
[ "${AWKLIBPATH+x}" ]&&set -- "AWKLIBPATH=$AWKLIBPATH" "$@"
set -- "$_shdotenv_exporter" "$@"
"${SHDOTENV_AWK:-awk}" "$@"
}
init_vars
parse_options "$@"
read_config_file ".shdotenv"
if [ $(($#-_shdotenv_pos+1)) -eq 0 ]||[ "$_shdotenv_nameonly" ];then
[ "$_shdotenv_quiet" ]&&exec >/dev/null
exec_parser "$@"
else
_shdotenv_format="sh"
_shdotenv_env=$(exec_parser "$@")
shift $((_shdotenv_pos-1))
eval "$_shdotenv_env"
case $1 in
export)shift
exec_exporter "$@"
;;
*)exec env "$@"
esac
fi
