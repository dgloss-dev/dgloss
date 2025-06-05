// ====================
// Users and Roles
// ====================
Table users {
  id int [pk, increment]
  email varchar
  role enum('OP', 'SV')
  name varchar
  cognito_username varchar
  created_at datetime
}

// ====================
// OPERATOR STATUS
// ====================
Table operator_status {
  id int [pk, increment]
  operator_id int [ref: > users.id]
  current_state enum('seated', 'away')
  call_session_id int [ref: > call_sessions.id, null]
  updated_at datetime
}

// ====================
// CALL STATUS HISTORY
// ====================
Table call_status_history {
  id int [pk, increment]
  operator_id int [ref: > users.id]
  call_session_id int [ref: > call_sessions.id, null]
  changed_at datetime
  changed_by int [ref: > users.id, null]
}

// ====================
// Call Lists & Callers
// ====================
Table call_lists {
  id int [pk, increment]
  name varchar
  created_by int [ref: > users.id]
  call_status enum('on_call', 'suspended', 'manual_stop', 'completed')
  voice_data_group_id int [ref: > voice_data_groups.id]
  no_ai int
  tel_num varchar
  ai_state boolean
  is_call_possible boolean
  description text
  remarks text
}

Table ai_call_slots {
  id int [pk, increment]
  call_list_id int [ref: > call_lists.id]
  start_time datetime
  end_time datetime
}

Table callers {
  id int [pk, increment]
  call_list_id int [ref: > call_lists.id]
  name varchar
  ordinal_num int
  industry_type varchar
  employee varchar
  annual_trading_session varchar
  person_in_charge int [ref: > users.id]
  call_permission boolean
  url varchar
  memo text
}

Table caller_phones {
  id int [pk, increment]
  caller_id int [ref: > callers.id]
  phone_number varchar
}

// ====================
// Labels and Flow
// ====================
Table labels {
  id int [pk, increment]
  text varchar
  intent varchar
  category varchar
}

// ====================
// Voice Data & Tags
// ====================
Table voice_data_groups {
  id int [pk, increment]
  name varchar
  description text
  created_by int [ref: > users.id]
  created_at datetime
}

Table voice_data {
  id int [pk, increment]
  audio_url varchar
  transcript text
  created_by int [ref: > users.id]
  created_at datetime
  duration number
}

Table voice_data_labels {
  id int [pk, increment]
  voice_data_id int [ref: > voice_data.id]
  label int [ref: > labels.id]
}

Table voice_data_group_mappings {
  id int [pk, increment]
  voice_data_id int [ref: > voice_data.id]
  voice_data_group_id int [ref: > voice_data_groups.id]
}

// ====================
// Call Sessions & History
// ====================
Table call_sessions {
  id int [pk, increment]
  caller_id int [ref: > callers.id]
  call_list_id int [ref: > call_lists.id]
  operator_id int [ref: > users.id]
  ai_initiated boolean
  start_time datetime
  end_time datetime
  status enum('answered', 'not_answered', 'handover', 'completed')
  ai_decision_path text
  recording_url varchar
  memo text
  handover_at datetime
  attempt_count int
  transcript_text text
}

Table conversation_flows {
  id int [pk, increment]
  voice_data_id int [ref: > voice_data.id]
  next_state_id int [ref: - conversation_flows.id]
  error_handling text
  end_flag boolean
}

// ====================
// Scheduling
// ====================
Table call_schedules {
  id int [pk, increment]
  caller_id int [ref: > callers.id]
  schedule_time datetime
  operator_id int [ref: > users.id]
  remarks text
  furigana text
  memo text
}

// ====================
// My List - Linking OP to Lists
// ====================
Table my_call_lists {
  id int [pk, increment]
  user_id int [ref: > users.id]
  caller_id int [ref: > callers.id]
}

// ====================
// Settings
// ====================
Table settings {
  id int [pk, increment]
  device_id int
  user_id int [ref: > users.id]
  sound_level int
}
Ï
