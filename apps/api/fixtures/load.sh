SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

kourou sdk:execute < $SCRIPT_DIR/1-setup-tenant.js
kourou sdk:execute < $SCRIPT_DIR/2-create-measure-history.js
