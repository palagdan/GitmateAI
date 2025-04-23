import { Context, Probot } from 'probot';

/**
 * Represents a slash command.
 */
class Command {
    constructor(
        public name: string,
        public callback: (context: Context, command: { name: string; arguments: string }) => Promise<void> | void,
    ) {
    }

    /**
     * Regular expression to match slash commands.
     */
    get matcher(): RegExp {
        return new RegExp(`^\/${process.env.PREFIX}\\s+([\\w-]+)\\b *(.*)?$`, 'm');
    }

    /**
     * Listens for GitHub events and triggers the callback if the command matches.
     */
    async listener(context: Context): Promise<void> {
        const body = context.payload["comment"].body;
        const commandMatch = body?.match(this.matcher);
        if (commandMatch && this.name === commandMatch[1]) {
            context.log.info(`Command "${this.name}" matched`);
            await this.callback(context, {name: commandMatch[1], arguments: commandMatch[2] || ''});
        }
    }
}


type AllowedEvents = 'issue_comment.created' | 'issues.opened' | 'pull_request.opened';

/**
 * Probot extension to abstract the pattern for receiving slash commands in comments.
*/
export default function command(
    robot: Probot,
    events: AllowedEvents | AllowedEvents[],
    name: string,
    callback: any
): void {
    const command = new Command(name, callback);
    robot.on(events, command.listener.bind(command));
}

