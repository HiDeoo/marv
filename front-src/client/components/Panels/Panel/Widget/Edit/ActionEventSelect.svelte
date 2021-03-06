<script>
  import { _ } from "@/libs/i18next";
  import capitalize from "capitalize";
  import { createEventDispatcher } from "svelte";
  import ShortcutInput from "./ShortcutInput.svelte";
  import Select from "@/components/UI/Select.svelte";
  import Notify from "@/components/UI/Notify.svelte";
  import { commands, rewards } from "@/stores/twitch";

  export let event;
  export let eventNames;
  export let showInvalidShortcutMessage = false;

  const dispatch = createEventDispatcher();

  const none = capitalize(_(`words.none`));
  const noneObject = { key: none, val: null };
  const rewardMap = (reward) => ({ val: reward.id, key: reward.title });

  $: commandNames = [
    noneObject,
    ...$commands.map((cmd) => ({
      key: cmd.name,
      val: cmd.name,
    })),
  ];

  $: rewardNames = $rewards
    ? [noneObject, ...$rewards.map(rewardMap)]
    : [noneObject];

  function onShortcutReset() {
    dispatch("shortcutReset");
  }

  function onChange(key, { detail: value }) {
    value = value === "null" ? null : value;
    dispatch("change", { key, value });
  }

  function onInvalidMessageClose() {
    showInvalidShortcutMessage = false;
  }
</script>

{#if event.eventName === 'onCommand'}
  <Select
    object="{true}"
    items="{commandNames}"
    value="{event.commandName}"
    label="{_('words.command')}"
    on:change="{onChange.bind(null, 'commandName')}"
  />
{:else if event.eventName === 'onRedemption'}
  <Select
    object="{true}"
    items="{rewardNames}"
    value="{event.rewardId}"
    label="{_('words.reward')}"
    on:change="{onChange.bind(null, 'rewardId')}"
  />
{:else if event.eventName === 'onShortcut'}
  {#if showInvalidShortcutMessage}
    <Notify
      type="warn"
      message="{_('sentences.global-shortcut-reserved')}"
      on:close="{onInvalidMessageClose}"
    />
  {:else}
    <ShortcutInput
      value="{event.shortcutName}"
      on:change="{onChange.bind(null, 'shortcutName')}"
      on:reset="{onShortcutReset}"
    />
  {/if}
{:else}
  <Select
    object="{true}"
    items="{eventNames}"
    value="{event.eventName}"
    label="{_('words.event')}"
    on:change="{onChange.bind(null, 'eventName')}"
  />
{/if}
