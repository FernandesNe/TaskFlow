{
  "name": "Task",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "T\u00edtulo da tarefa"
    },
    "description": {
      "type": "string",
      "description": "Descri\u00e7\u00e3o detalhada da tarefa"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "in_progress",
        "completed",
        "cancelled"
      ],
      "default": "pending",
      "description": "Status atual da tarefa"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "urgent"
      ],
      "default": "medium",
      "description": "Prioridade da tarefa"
    },
    "category_id": {
      "type": "string",
      "description": "ID da categoria associada"
    },
    "due_date": {
      "type": "string",
      "format": "date",
      "description": "Data de vencimento"
    },
    "completed_at": {
      "type": "string",
      "format": "date-time",
      "description": "Data de conclus\u00e3o"
    }
  },
  "required": [
    "title"
  ]
}