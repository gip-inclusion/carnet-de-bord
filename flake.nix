{
  description = "Carnet de bord";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages."${system}";
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            libxml2 # Libxml2 is required for the python lib lxml
            # Indirect dependencies of libxml2
            zlib
            pkg-config
          ];
          packages = with pkgs; [
            nodejs_20
            python311
            pre-commit
            poetry
            gnumake
            tmux
          ];
        };
      });
}
