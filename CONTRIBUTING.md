# Contribution Rules

1. Never add secrets to the repository.
2. Never replace deterministic factor lookup with LLM similarity or guessed values.
3. Never move authoritative arithmetic into prompts/frontend code.
4. Preserve `record_id` exactly across all agent handoffs.
5. Add adversarial tests when changing prompts or tool contracts.
6. Record measured latency/token changes instead of claiming optimization without evidence.
7. Keep Lyzr Agent Studio configuration and runtime documentation synchronized with the deployed system.
