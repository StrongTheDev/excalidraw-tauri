mod models;

use std::{
    fs::read_to_string,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
};

use log::{error, info};
use tauri::{
    menu::Menu,
    tray::{MouseButtonState, TrayIconBuilder},
    window::*,
    AppHandle, Emitter, Listener, Manager,
};
use tauri_plugin_fs::FsExt as _;

use crate::models::Payload;

static INIT: AtomicBool = AtomicBool::new(false);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default();
    builder
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            let scope = app.fs_scope();
            dbg!(scope.allowed_patterns());

            let window: Window = app.get_window("main").expect("Window not yet built");
            let menu = Menu::new(app).unwrap();
            let tray = TrayIconBuilder::new()
                .menu(&menu)
                .icon(app.default_window_icon().unwrap().clone())
                .title("Excalidraw - Desktop")
                .build(app)?;
            tray.on_tray_icon_event(move |_i, e| {
                match e {
                    tauri::tray::TrayIconEvent::Click {
                        id: _,
                        position: _,
                        rect: _,
                        button: _,
                        button_state,
                    } => {
                        if let MouseButtonState::Down = button_state {
                            // println!("Clicked tray icon");
                            if window.is_visible().unwrap() {
                                window.hide().unwrap();
                            } else {
                                window.show().unwrap();
                            }
                        }
                    }
                    // tauri::tray::TrayIconEvent::DoubleClick { id, position, rect, button } => todo!(),
                    // tauri::tray::TrayIconEvent::Enter { id, position, rect } => todo!(),
                    // tauri::tray::TrayIconEvent::Move { id, position, rect } => todo!(),
                    // tauri::tray::TrayIconEvent::Leave { id, position, rect } => todo!(),
                    _ => {}
                }
            });
            let events: Vec<(&str, Payload)> = Vec::new();
            let events_arc = Arc::new(Mutex::new(events));
            let events_clone = Arc::clone(&events_arc);
            #[cfg(desktop)]
            {
                let _ = app
                    .handle()
                    .plugin(tauri_plugin_single_instance::init(
                        move |handle, args, cwd| {
                            info!("{args:?} in {cwd}");
                            let mut events = events_clone.lock().unwrap();
                            handle_files(handle, args, &mut events);
                        },
                    ))
                    .unwrap();
            }

            // ARGS
            let args: Vec<String> = std::env::args().collect();
            info!("Startup args: {:?}", args);

            // If opened by double-click, the path will be in args[1]
            let events_clone = Arc::clone(&events_arc);
            {
                let mut events = events_clone.lock().unwrap();
                handle_files(app.handle(), args, &mut events);
            }

            let events_clone = Arc::clone(&events_arc);
            let handle = app.handle().clone();
            app.handle().once("appReady", move |_| {
                info!("Webview ready...");
                INIT.store(true, Ordering::SeqCst);
                let mut events = events_clone.lock().unwrap();
                publish_events(&handle, &mut events);
            });

            info!("The app has been initialized!...");
            info!("Displaying the app...");
            let _ = app.get_window("main").unwrap().show().unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[inline]
fn handle_files(app_handle: &AppHandle, args: Vec<String>, events: &mut Vec<(&str, Payload)>) {
    // handle files
    if args.len() > 1 {
        let var_name = &args[1];
        let file_path = var_name.clone();
        info!("Opening file: {}", file_path);
        handle_excalidraw_file(&file_path, events);
    }

    publish_events(app_handle, events);
}

fn publish_events(app_handle: &AppHandle, events: &mut Vec<(&str, Payload)>) {
    if INIT.load(Ordering::SeqCst) {
        for event in events {
            app_handle.emit(event.0, event.1.clone()).unwrap();
        }
    }
}

fn handle_excalidraw_file(file_path: &str, events: &mut Vec<(&str, Payload)>) {
    // use std::fs::{create_dir, exists, OpenOptions, File};
    if file_path.ends_with("excalidraw") {
        events.push((
            "openFile",
            Payload::new(file_path.to_owned(), file_path.to_owned()),
        ));
    } else if file_path.ends_with("excalidrawlib") {
        let content = read_to_string(file_path).unwrap();
        events.push(("addLibrary", Payload::new(file_path.to_owned(), content)));
    } else {
        error!("Unknown file type being opened: {}", file_path);
        events.push((
            "unknownFile",
            Payload::new(
                file_path.to_owned(),
                String::from("This file type is not supported."),
            ),
        ));
    }
}
