# CrxOop
Bringing Object Oriented Programming (classical), and Proper Prototype Based Programming, To Javascript

Supported Features (classical OOP):

- Classes.
- Class public constructors.
- Class public and private variables. Public variables are supported on roughly IE9 era browsers and later.
- Class public, protected and private functions.
- Class public virtual, protected virtual, and private virtual functions, including support for "finals" and pure virtual functions. Pure virtual functions can not be finals. 
- Casting.
- Data Typing. See also Class Typing. 
- Class public and private static variables. Private static variables are supported on roughly IE9 era browsers and later.
- Class public and private constants. Private constants are supported on roughly IE9 era browsers and later.
- Class public and private static functions. Private static functions are supported on roughly IE9 era browsers and later.
- Friend Classes.
- Abstract Classes.
- Anonymous Classes.
- Interfaces (a Class with only public pure virtual methods).


V1.4 of the library introduces a formalization of Prototype Based Programming, or as this author likes to call it, Prototype Object Based Programming (POBP).

Supported Features (POBP):

- Shared Public Scope (Variable): When a variable member has this scope, it is equivalent to setting the variable on 'this' in the constructor function when coding using plain javascript. Hence, the word 'shared' in the scope name. The variable is visible to all inheriting structures, and only one copy of it exists per instance. Shared public variables are supported on roughly IE9 era browsers and later. 
- Shared Public Scope (Function): When a function member has this scope, it is equivalent to setting the function on the prototype of the constructor function when coding using plain javascript. One, hence the word 'shared'. Two, there exists only one data entry for each function global to all objects of a particular prototype based data type. This would be contrary to setting the function on 'this' in the constructor function when coding using plain javascript. 
- Shared Private Scope (Variables and Functions): When a variable member, or a function member, has this scope the member can only be accessed on 'this'. If a structure 'A' defines the member 'x' with this scope, then only functions of 'A' can see 'x'. 'x' is private to 'A'. However, note the word 'shared'. If Structure 'B' inherits structure 'A', then functions of 'B' also have access to 'x'. But not only that, but also if 'A' itself inherits 'C', then functions of 'C' can also see 'x'. In other words, exactly like the shared public scope case, but only members of the structure chain of the instance may see 'x'. It should be noted, that this privacy is across instances, like in OOP. Refer to the structure keyword 'O' in the documentation. Shared private variables are supported on roughly IE9 era browsers and later. 
- Private Scope (Variables and Functions): When a variable member, or a function member, has this scope the member can only be accessed on functions of the same structure. This is usualy enforced in plain javascript by declaring each such members as 'var' in the constructor function taking advantage of closures. However, unlike the plain javascript case, this privacy is across structure instances. Refer to the structure keyword 'O' in the documentation. 
- Public Constructors: The public scope is supported for constructors only. The scope, and constructors act as expected when coding using plain javascript, but with the added benefit of the guaranteed default constructor invocation like in the OOP case. 
- Multiple Inheritance. 
- Data Typing. See also Structrure Typing. 
- Iteration using the native javascript built "for in" loop mechanism. CrxOop provides HASOWN(), an equivalent to the built in hasOwnProperty().


For details and documentation refer to http://EyeAndTea.com

If you are using this on Node.js make sure to read http://EyeAndTea.com/crxoop/v2/ch09.


## Example code (from documentation link above)

```javascript
crx_registerInterface("InterfaceA",
{
	"interfaceAFunction": 0
});

crx_registerInterface("InterfaceB",
{
	"interfaceBFunction": 0
});

crx_registerInterface("InterfaceC",
{
	INHERITS: ["InterfaceA", "InterfaceB"],
	"interfaceCFunction1": 0,
	"interfaceCFunction2": 0
});

crx_registerInterface("InterfaceD",
{
	"interfaceDFunction": 0
});
									
crx_registerClass("classA",
{
	"VERBOSE": 1,
	"FRIENDS": ["classD"],

	"PUBLIC CONSTRUCT": function()
	{
		console.log("CONSTRUCTING A");
	},

	"PUBLIC VAR publicVar": "classA::publicVar",
	"PUBLIC VAR publicVar2": 5,
	"PUBLIC VAR publicVar3": [0, 0, 0, 0, 0],
	"PUBLIC STATIC VAR publicStaticVar": "classA::publicStaticVar",

	"PUBLIC STATIC FUNCTION publicStaticFunction": function(pClassA)
	{
		console.log("[START]classA::publicStaticFunction()");
		this.STATIC.privateStaticFunction(5);
		console.log(crx_static("classA").publicStaticVar); //OR this.STATIC.publicStaticVar
		console.log(this.STATIC.privateStaticVar);
		console.log(this.O(pClassA).privateVar);
		console.log("[END]classA::publicStaticFunction()");
	},

	"PUBLIC FUNCTION publicFunction": function(pA)
	{
		console.log("classA::publicFunction()");
	},

	"PUBLIC FUNCTION test": function(pA)
	{
		console.log("[START]classA::test()");
		this.publicVirtualFunction(5);
		this.privateVirtualFunction(5);
		this.publicPureVirtualFunction(5);
		this.privatePureVirtualFunction(5);
		this.protectedPureVirtualFunction(5);
		this.publicFunction(5);
		this.privateFunction(5);
		this.STATIC.privateStaticFunction(5);
		console.log(this.STATIC.publicStaticVar);
		console.log(this.STATIC.privateStaticVar);
		console.log("[END]classA::test()");
		return this.THIS;
	},

	"PUBLIC VIRTUAL FUNCTION publicVirtualFunction": function(pA)
	{
		console.log("classA::publicVirtualFunction()");
	},

	"PUBLIC VIRTUAL FUNCTION publicPureVirtualFunction": 0,

	"PRIVATE VAR privateVar": "classA::privateVar",
	"PRIVATE STATIC VAR privateStaticVar": "classA::privateStaticVar",

	"PRIVATE STATIC FUNCTION privateStaticFunction": function(pA)
	{
		console.log("classA::privateStaticFunction()");
	},

	"PRIVATE FUNCTION privateFunction": 	function(pA)
	{
		console.log("classA::privateFunction()");
	},

	"PRIVATE VIRTUAL FUNCTION privateVirtualFunction": function(pA)
	{
		console.log("classA::privateVirtualFunction()");
	},

	"PRIVATE VIRTUAL FUNCTION privatePureVirtualFunction": 0,
									
	"PROTECTED FUNCTION protectedFunction": 	function(pA)
	{
		console.log("classA::protectedFunction()");
	},

	"PROTECTED VIRTUAL FUNCTION protectedVirtualFunction": function(pA)
	{
		console.log("classA::protectedVirtualFunction()");
	},

	"PROTECTED VIRTUAL FUNCTION protectedPureVirtualFunction": 0
});
crx_registerClass("classB",
{
	"VERBOSE": 1,
	"IMPLEMENTS": ["InterfaceC", "InterfaceD"],
	"EXTENDS": "classA",

	"PUBLIC CONSTRUCT": function(pA)
	{
		console.log("CONSTRUCTING B");
	},

	"PUBLIC VAR publicVar": "classB::publicVar",

	"PUBLIC FUNCTION publicFunction": function(pA)
	{
		console.log("classB::publicFunction()");
		if(pA != 1)
			{this.publicFunction(1);}
		this.PARENT.publicFunction(5);
	},

	"PUBLIC FUNCTION test": function(pA)
	{
		console.log("[START]classB::test()");
		this.publicVirtualFunction(5);
		this.publicFunction(5);
		this.CAST("classA").publicFunction(5);
		console.log("[END]classB::test()");
		return this.THIS;
	},

	"PUBLIC VIRTUAL FUNCTION publicVirtualFunction": function(pA)
	{
		console.log("classB::publicVirtualFunction()");
		this.SR(null, "publicVirtualFunction", pA);
	},

	"PUBLIC VIRTUAL FUNCTION interfaceAFunction": function(pA)
		{},
	"PUBLIC VIRTUAL FUNCTION interfaceBFunction": function(pA)
		{},
	"PUBLIC VIRTUAL FUNCTION interfaceCFunction1": function(pA)
		{},
	"PUBLIC VIRTUAL FUNCTION interfaceCFunction2": function(pA)
		{},
	"PUBLIC VIRTUAL FUNCTION interfaceDFunction": function(pA)
		{}
});
crx_registerClass("classC",
{
	"VERBOSE": 1,
	"EXTENDS": "classB",

	"PUBLIC CONSTRUCT": function()
	{
		this.PARENT.CONSTRUCT(5);
		console.log("CONSTRUCTING C");
	},

	"PUBLIC VIRTUAL FUNCTION publicVirtualFunction": function(pA)
	{
		console.log("classC::publicVirtualFunction()");
		this.SR("classA", "publicVirtualFunction", pA);
		this.SR("classA", "publicFunction", pA);
		this.SR("classA", "publicVar2", 6);
		this.SR("classA", "publicVar3")[0] = 1;
		console.log(this.SR("classA", "publicVar3")[0]);
	},

	"PUBLIC VIRTUAL FUNCTION publicPureVirtualFunction": function(pA)
	{
		console.log("classC::publicPureVirtualFunction()\n");
	},

	"PRIVATE VIRTUAL FUNCTION privatePureVirtualFunction": function(pA)
	{
		console.log("classC::privatePureVirtualFunction()");
	},

	"PROTECTED VIRTUAL FUNCTION protectedPureVirtualFunction": function(pA)
	{
		console.log("classC::protectedPureVirtualFunction()");
	}
});
									
crx_registerClass('classD',
{
	"VERBOSE": 1,

	"PUBLIC FUNCTION test": function(pClassA)
	{
		console.log("[START]classD::test()");
		console.log(this.O(pClassA, "classA").privateVar);
		this.O(pClassA, "classA").privatePureVirtualFunction(5);
		this.O(pClassA, "classA").protectedFunction(5);
		console.log("[END]classD::test()");
	}
});
var a = crx_new("classC");
var b = crx_new("classD");
									
a.test(5);
a.CAST("classA").test(5);
crx_static("classA").publicStaticFunction(a.CAST("classA"));
b.test(a.CAST("classA"));
```


And the result:

```text
CONSTRUCTING B
CONSTRUCTING A
CONSTRUCTING C
[START]classB::test()
classC::publicVirtualFunction()
classA::publicVirtualFunction()
classA::publicFunction()
1
classB::publicFunction()
classB::publicFunction()
classA::publicFunction()
classA::publicFunction()
classA::publicFunction()
[END]classB::test()
[START]classA::test()
classC::publicVirtualFunction()
classA::publicVirtualFunction()
classA::publicFunction()
1
classA::privateVirtualFunction()
classC::publicPureVirtualFunction()
classC::privatePureVirtualFunction()
classC::protectedPureVirtualFunction()
classA::publicFunction()
classA::privateFunction()
classA::privateStaticFunction()
classA::publicStaticVar
classA::privateStaticVar
[END]classA::test()
[START]classA::publicStaticFunction()
classA::privateStaticFunction()
classA::publicStaticVar
classA::privateStaticVar
classA::privateVar
[END]classA::publicStaticFunction()
[START]classD::test()
classA::privateVar
classC::privatePureVirtualFunction()
classA::protectedFunction()
[END]classD::test()
```