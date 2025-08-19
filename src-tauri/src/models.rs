// use serde::Deserialize;
use serde::Serialize;
// use serde_json::Value;

// #[derive(Debug, Serialize, Deserialize)]
// pub struct ExcalidrawLib {
//     pub version: i8,
//     #[serde(rename = "type")]
//     pub file_type: String,
//     pub source: Option<String>,
//     pub library: Option<Vec<Vec<Value>>>,
//     #[serde(rename = "libraryItems")]
//     pub library_items: Option<Vec<Value>>
// }

// #[derive(Debug, Serialize, Deserialize)]
// pub struct ExcalidrawFile {
//     pub version: i8,
//     #[serde(rename = "type")]
//     pub file_type: String,
//     pub source: Option<String>,
//     pub elements: Vec<Value>,
//     #[serde(rename = "appState")]
//     pub app_state: Value,
//     pub files: Value,
// }

// impl ExcalidrawLib {
//     pub fn new() -> Self {
//         Self {
//             version: 2,
//             file_type: "excalidrawlib".to_owned(),
//             source: Some("https://app.excalidraw.com".to_owned()),
//             library: None,
//             library_items: None,
//         }
//     }
// }

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Payload {
    file_name: String,
    content: String,
}

impl Payload {
    pub fn new(file_name: String, content: String) -> Self {
        Self { file_name, content }
    }
}
