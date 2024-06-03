# Questionnaire

- How much time did it take you?

4 hours

- How did you think about testing your code?

Unit tests for low-level code that plays a critical role in certain functionalities.

If I had more time, I would have also tested the React DOM, interaction, to test to see if the input box also updates as the user slides the slider, or if the user checks a checkbox. I would have also checked the number of characters/words in the input box.

- How did you verify your solution meets the requirements?

Thorough manual test, to verify that everything is functional, in accordance to the requirements.

- What tradeoffs did you make and why?

I had a choice between different "screens" for the different types of passwords, or to have everything coupled into a single component, and update the individual components from there.

The former is easier to implement, and there seems to be a looser coupling between components, but a problem arises when flipping through the different "types" of passwords.

If I used the "paging" approach, I'd lose the intermediate state from "page" to "page". Those being the character/word/digit lengths, as the user pages from type to type.

But I did not opt for that. I instead opt for the tight coupling approach, to be able to retain state.

Of course, I could have retained state if I instead moved the state up a a level.

- Shortcuts are encouraged to keep time investment of the assignment minimal. What shortcuts did you take? Anything you specifically want to mention that you wouldn’t normally do?

I did not use a more all-encompassing state management logic.

Currently, the various "types" of passwords are shared in the same component.

If I moved the state into a state-machine-like state (akin to Redux), then I'd probably be able to benefit from the "paging" approach.

- What was tricky and why?

Flipping through the different types of passwords was the tricky part to implement, but not because this is overall tricky to implement, but because of the approach that I went with.
