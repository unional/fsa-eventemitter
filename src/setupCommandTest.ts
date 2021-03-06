import { unpartial } from 'unpartial';
import { Command, CommandConstructor, CommandContext } from './Command';
import { TestEmitter } from './TestEmitter';

export function setupCommandTest<Context extends CommandContext, Cmd extends Command>(Command: CommandConstructor<Context, Cmd>, givenContext: Partial<Context> = {}) {
  const emitter = new TestEmitter()
  const context = unpartial<Context>({ emitter } as any, givenContext)
  const command = new Command(context)
  return { emitter, command }
}
