use anyhow::Error;
use fluentci_pdk::dag;

pub fn setup_heroku() -> Result<(), Error> {
    let ok = dag()
        .devbox()?
        .with_exec(vec!["devbox init || true"])?
        .with_exec(vec!["devbox run -- type dpl || echo KO"])?
        .stdout()?;
    if !ok.contains("KO") {
        return Ok(());
    }

    dag()
        .devbox()?
        .with_exec(vec!["devbox init || true"])?
        .with_exec(vec![
            "devbox",
            "add",
            "ruby@2.7.8",
            "nodejs",
            "git",
            "gnumake",
            "gcc",
        ])?
        .with_exec(vec!["devbox run -- gem install dpl --pre"])?
        .stdout()?;
    Ok(())
}
