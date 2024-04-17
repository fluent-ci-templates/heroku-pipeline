use std::vec;

use extism_pdk::*;
use fluentci_pdk::dag;

use crate::helpers::setup_heroku;

pub mod helpers;

#[plugin_fn]
pub fn deploy(args: String) -> FnResult<String> {
    setup_heroku()?;
    let stdout = dag()
        .devbox()?
        .with_exec(vec!["devbox run -- dpl heroku api", &args])?
        .stdout()?;
    Ok(stdout)
}
