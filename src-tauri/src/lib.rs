use std::process::Command;
use serde::Serialize;
use regex::Regex;

#[derive(Serialize)]
struct ScreenInfo {
    name: String,
    resolution: Option<String>,
    brightness: Option<f64>,
}

#[tauri::command]
fn get_connected_screens() -> Result<Vec<String>, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("xrandr | grep ' connected' | cut -d ' ' -f1")
        .output();

    match output {
        Ok(o) => {
            if !o.stdout.is_empty() {
                let result: Vec<String> = String::from_utf8_lossy(&o.stdout)
                    .trim()
                    .split('\n')
                    .map(|s| s.to_string())
                    .collect::<Vec<String>>();
                return Ok(result);
            } else if !o.stderr.is_empty() {
                let error = String::from_utf8_lossy(&o.stderr).to_string();
                return Err(error);
            } else {
                let error = "Command executed but no output".to_string();
                return Err(error);
            }
        }
        Err(e) => {
            let error: String = format!("Failed to execute command: {}", e);
            return Err(error);
        }
    }
}

#[tauri::command]
fn get_screen_info(name: String) -> Result<ScreenInfo, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg(format!("xrandr --verbose | awk -v screen=\"{}\" '$0 ~ \"^\"screen {{print; found=1; next}} found && /^[A-Za-z0-9-]+/ {{found=0}} found'", name))
        .output();

    match output {
        Ok(o) => {
            if !o.stdout.is_empty() {
                let result = String::from_utf8_lossy(&o.stdout).to_string();
                return Ok(parse_screen_info(name, result));
            } else {
                let error: String = "No standard output".to_string();
                return Err(error);
            }
        }
        Err(e) => {
            let error: String = format!("Failed to execute command: {}", e);
            return Err(error);
        }
    }
}

fn parse_screen_info(name: String, raw_output: String) -> ScreenInfo {
    // Use a capturing group to extract the brightness value
    let re_brightness = Regex::new(r"Brightness:\s*(\d+\.\d+)").unwrap();
    let re_resolution = Regex::new(r"(\d+x\d+)(?:\+|$)").unwrap();
    
    let brightness = re_brightness
        .captures(&raw_output)
        .and_then(|caps| caps.get(1).and_then(|m| m.as_str().parse::<f64>().ok()));

    let resolution = re_resolution
        .captures(&raw_output)
        .and_then(|caps| caps.get(1).map(|m| m.as_str().to_string()));

    return ScreenInfo {
        name,
        brightness,
        resolution,
    };
}

#[tauri::command]
fn set_screen_brightness(name: String, brightness: f64) -> Result<i64, String> {
    if brightness > 1.0 || brightness < 0.2 {
        return Err("Brightness out of range [0.2, 1.0]".to_string());
    }
    
    let output = Command::new("xrandr")
        .arg("--output")
        .arg(&name)
        .arg("--brightness")
        .arg(format!("{:.2}", brightness))
        .output();

    match output {
        Ok(o) => {
            if o.stdout.is_empty() && o.stderr.is_empty() {
                return Ok(0);
            } else {
                let error: String = String::from_utf8_lossy(&o.stderr).to_string();
                return Err(error);
            }
        },
        Err(_) => {
            let error: String = "Error running the xrandr command".to_string();
            return Err(error);
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_connected_screens, get_screen_info, set_screen_brightness])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
