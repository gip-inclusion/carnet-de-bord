from jinja2 import Environment, PackageLoader, select_autoescape

jinja_env = Environment(loader=PackageLoader("api"), autoescape=select_autoescape())
