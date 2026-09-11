# Lyzr Agent Configurations

These files are the repository representation of the CarbonGuard Lyzr agent layer.

## Agents

1. `intake-agent.json`
2. `scope-classifier-agent.json`
3. `factor-resolver-agent.json`
4. `governance-agent.json`
5. `disclosure-agent.json`
6. `carbonguard-esg-superflow.json`

The production pattern is:

`Trigger → Intake → Scope → Factor Resolver → Governance → Disclosure`

The Factor Resolver is the only agent with access to the deterministic factor/calculation tools.
