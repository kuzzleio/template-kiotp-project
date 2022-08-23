Feature: Example Decoder

  Scenario: Decode temperature
    When I send the following "example" payloads:
      | reference | temperature |
      | "1"       | 18          |
    Then The document "platform":"devices":"Example-1" content match:
      | measures[0].type               | "temperature" |
      | measures[0].values.temperature | 18            |
